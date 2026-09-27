import { Group as FabricGroup } from 'fabric';

import Base from './Base';
import { LayerType } from '../../types';
import parseSVG from '../parser';
import { getSelectionType } from '../utils/get-selection-type';
import { generateId } from '../utils/id';
import ObjectExporter from '../utils/object-exporter';
import ObjectImporter from '../utils/object-importer';
import { base64ImageToFile } from '../utils/parser';

import type { ILayer, IScene, IStaticVideo } from '../../types';

export type ExportedComponent = Omit<ILayer, 'metadata'> & {
  metadata: Record<string, unknown> & {
    category: 'mixed' | 'single';
    types: string[];
  };
};

export interface ExportedLayerResource {
  id?: string;
  type: 'StaticVideo' | 'StaticImage';
  url: string;
  duration: number;
  display: { from: number; to: number };
  cut: { from: number; to: number };
  position: {
    x?: number;
    y?: number;
    zIndex: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
  };
  objectId?: string;
}

class Scene extends Base {
  private id = '';

  private name?: string = '';

  public exportToJSON(): IScene {
    const animated = false;

    const canvasJSON: any = this.canvas.toObject(
      this.config.propertiesToInclude
    );
    const frame = this.editor.frame.options;
    const template: IScene = {
      id: this.id ? this.id : generateId(),
      name: this.name ? this.name : 'Untitled design',
      layers: [],
      frame: {
        width: frame.width,
        height: frame.height,
      },
      metadata: {
        animated,
      },
    };

    const layers = canvasJSON.objects.filter(
      (object: any) => object.type !== LayerType.FRAME
    );
    const objectExporter = new ObjectExporter();

    layers.forEach((layer: ILayer) => {
      const exportedObject = objectExporter.export(layer, frame);
      template.layers = template.layers.concat(exportedObject);
    });
    template.metadata = {
      ...template.metadata,
      animated,
    };
    return template;
  }

  public exportAsComponent = async (): Promise<
    ExportedComponent | undefined
  > => {
    const activeObject = this.canvas.getActiveObject();
    const selectionType = getSelectionType(activeObject);
    const frame = this.editor.frame.options;
    const objectExporter = new ObjectExporter();

    if (activeObject && selectionType) {
      const isMixed = selectionType.length > 1;

      const propertiesToInclude = (this.editor.config.propertiesToInclude ??
        []) as never[];

      if (
        activeObject.type === 'activeSelection' ||
        activeObject.type === 'group'
      ) {
        const objects =
          activeObject instanceof FabricGroup ? activeObject.getObjects() : [];
        const clonedObjects = await Promise.all(
          objects.map(async (object) => {
            const cloned = await object.clone();
            cloned.clipPath = undefined;
            return cloned;
          })
        );

        const group = new FabricGroup(clonedObjects);

        const groupData = group.toObject(
          propertiesToInclude
        ) as unknown as ILayer;

        const component = objectExporter.export(groupData, frame);
        const metadata = component.metadata ?? {};

        return {
          ...component,
          top: 0,
          left: 0,
          metadata: {
            ...metadata,
            category: isMixed ? 'mixed' : 'single',
            types: selectionType,
          },
        };
      }

      const activeObjectData = activeObject.toObject(
        propertiesToInclude
      ) as ILayer;

      const component = objectExporter.export(activeObjectData, frame);
      const metadata = component.metadata ?? {};

      return {
        ...component,
        top: 0,
        left: 0,
        metadata: {
          ...metadata,
          category: isMixed ? 'mixed' : 'single',
          types: selectionType,
        },
      };
    }
  };

  /**
   * Export Canvas objects to be loaded as resources by PIXI loader
   * @returns
   */
  public exportLayers = async (
    template: IScene
  ): Promise<ExportedLayerResource[]> =>
    Promise.all(
      template.layers.map(async (layer, index) => {
        const isVideo = layer.type === LayerType.STATIC_VIDEO;
        const url = isVideo
          ? (layer as IStaticVideo).src
          : base64ImageToFile(
              await this.editor.renderer.renderLayer(
                layer as Required<ILayer>,
                {}
              )
            );
        return {
          id: layer.id,
          type: isVideo ? 'StaticVideo' : 'StaticImage',
          url,
          duration: 5000,
          display: { from: 0, to: 5000 },
          cut: { from: 0, to: 0 },
          position: {
            x: layer.left,
            y: layer.top,
            zIndex: index,
            width: layer.width,
            height: layer.height,
            scaleX: layer.scaleX,
            scaleY: layer.scaleY,
          },
          objectId: layer.id,
        };
      })
    );

  /**
   * Monotonic token identifying the newest import. `importFromJSON` clears the
   * canvas and then awaits (fonts, images), so two overlapping calls used to
   * interleave their `canvas.add()` calls — leaving duplicated Background /
   * layer objects and letting whichever import finished last win the frame size
   * and background colour. Every import claims a generation and bails out as
   * soon as a newer one has started.
   */
  private importGeneration = 0;

  /**
   * Deserializes JSON data
   * @returns Json Template
   */
  public importFromJSON = async (template: IScene) => {
    this.importGeneration += 1;
    const generation = this.importGeneration;
    const isStale = () => generation !== this.importGeneration;

    this.name = template.name;
    this.id = template.id;
    const frameParams = template.frame;
    this.editor.objects.clear();
    this.editor.frame.resize({
      width: frameParams.width,
      height: frameParams.height,
    });

    const frame = this.editor.frame.frame as any;

    await this.editor.fonts.ensure(template);
    if (isStale()) return;

    const objectImporter = new ObjectImporter(this.editor);
    await (template.layers as Required<ILayer>[]).reduce(
      async (previous, layer) => {
        await previous;
        if (isStale()) return;
        const element = await objectImporter.import(layer, frame);
        if (isStale() || !element) return;
        if (this.config.clipToFrame) {
          element.clipPath = frame;
        }
        if (element.type === LayerType.BACKGROUND) {
          this.canvas
            .getObjects()
            .filter((object) => object.type === LayerType.BACKGROUND)
            .forEach((object) => this.canvas.remove(object));
        }
        this.canvas.add(element);
      },
      Promise.resolve()
    );
    if (isStale()) return;
    this.editor.zoom.zoomToFit();
    this.editor.objects.updateContextObjects();
    this.editor.history.save();
    this.canvas.requestRenderAll();
  };

  public async importFromSVG(url: string) {
    const design = await parseSVG(url);
    await this.importFromJSON(design as IScene);
  }
}
export default Scene;
