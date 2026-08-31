import type { FabricObject } from 'fabric';

import { LayerType } from '../../../types';

import ObjectImporter from '../../utils/object-importer';

import type { ILayer, ILayerOptions } from '../../../types';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsManager {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  public add = async (
    item: Partial<
      ILayer & {
      skipCentering?: boolean;
    }
    >,
  ) => {
    const { canvas } = this.context;
    const { options } =
      this.context.editor.frame;

    const objectImporter =
      new ObjectImporter(
        this.context.editor,
      );

    const object =
      await objectImporter.import(
        item as ILayer,
        options,
      );

    if (this.context.config.clipToFrame) {
      object.clipPath =
        this.context.editor.frame.frame as any;
    }

    const isBackgroundImage =
      item.type === LayerType.BACKGROUND_IMAGE;

    let currentBackgroundImage: FabricObject | null =
      null;

    if (isBackgroundImage) {
      currentBackgroundImage =
        await this.context.editor.objects.unsetBackgroundImage();
    }

    canvas.add(object);

    if (isBackgroundImage) {
      canvas.moveObjectTo(object, 2);

      this.context.editor.objects.scale(
        'fill',
        object.id,
      );

      if (currentBackgroundImage) {
        canvas.add(currentBackgroundImage);

        this.context.editor.objects.sendToBack(
          currentBackgroundImage.id,
        );
      }
    } else if (item.skipCentering) {
      object.set({
        left: item.left,
        top: item.top,
      });

      object.setCoords();
    } else {
      canvas.centerObject(object);
      object.setCoords();
    }

    canvas.setActiveObject(object);
    this.context.state.setActiveObject(object);

    this.context.updateContextObjects();

    this.context.editor.history.save();

    if (object.type === 'StaticVideo') {
      setTimeout(() => {
        canvas.requestRenderAll();
      }, 500);
    }
  };

  private updateTextSelection = (
    object: any,
    property: string,
    value: unknown,
  ) => {
    const hasSelection =
      object.isEditing &&
      object.selectionStart !==
      object.selectionEnd;

    if (
      !hasSelection ||
      ![
        'fontSize',
        'fontFamily',
        'fontWeight',
        'fontStyle',
        'fill',
        'underline',
        'linethrough',
      ].includes(property)
    ) {
      return false;
    }

    object.setSelectionStyles({
      [property]: value,
    });

    return true;
  };

  private updatePosition = (
    object: FabricObject,
    property: string,
    value: unknown,
  ) => {
    if (
      property !== 'angle' &&
      property !== 'top' &&
      property !== 'left'
    ) {
      return false;
    }

    if (property === 'angle') {
      object.rotate(value as number);
    } else {
      object.set(
        property,
        value as number,
      );
    }

    object.setCoords();

    return true;
  };

  private updateClipPath = (
    object: FabricObject,
    property: string,
    value: unknown,
  ) => {
    if (property !== 'clipToFrame') {
      return false;
    }

    object.set(
      'clipPath',
      value
        ? this.context.editor.frame.frame
        : null,
    );

    object.setCoords();

    return true;
  };

  private updateMetadata = (
    object: FabricObject,
    property: string,
    value: unknown,
  ) => {
    if (property !== 'metadata') {
      return false;
    }

    object.set('metadata', {
      ...(object as any).metadata,
      ...(value as Record<string, unknown>),
    });

    return true;
  };

  private updateActiveSelection = (
    object: FabricObject,
    property: string,
    value: unknown,
  ) => {
    if (
      object.type !==
      LayerType.ACTIVE_SELECTION ||
      !(object as any)._objects
    ) {
      return false;
    }

    const objects =
      (object as any)
        ._objects as FabricObject[];

    objects.forEach((child) => {
      if (property === 'metadata') {
        child.set('metadata', {
          ...(child as any).metadata,
          ...(value as Record<string, unknown>),
        });
      } else {
        child.set(
          property as any,
          value as any,
        );
      }

      child.setCoords();
    });

    return true;
  };

  private updateProperty = (
    object: FabricObject,
    property: string,
    value: unknown,
  ) => {
    if (
      this.updateTextSelection(
        object,
        property,
        value,
      )
    ) {
      return;
    }

    if (
      this.updatePosition(
        object,
        property,
        value,
      )
    ) {
      return;
    }

    if (
      this.updateClipPath(
        object,
        property,
        value,
      )
    ) {
      return;
    }

    if (
      property === 'shadow'
    ) {
      this.context.editor.objects.setShadow(
        value as any,
      );

      return;
    }

    if (
      this.updateMetadata(
        object,
        property,
        value,
      )
    ) {
      return;
    }

    if (
      this.updateActiveSelection(
        object,
        property,
        value,
      )
    ) {
      return;
    }

    object.set(
      property as any,
      value as any,
    );

    object.setCoords();
  };

  public update = (
    options: Partial<ILayerOptions>,
    id?: string,
  ) => {
    if (this.context.editor.history.isActive) {
      return;
    }

    const refObject =
      this.context.getRefObject(id);

    if (!refObject) {
      return;
    }

    Object.entries(options).forEach(
      ([property, value]) => {
        this.updateProperty(
          refObject,
          property,
          value,
        );
      },
    );

    this.context.canvas.requestRenderAll();

    this.context.editor.history.save();
    this.context.updateContextObjects();
  };

  public clear = () => {
    const objects =
      this.context.canvas
        .getObjects()
        .slice();

    objects.forEach((object) => {
      if (
        object.type !== LayerType.FRAME
      ) {
        this.context.canvas.remove(object);
      }
    });

    this.context.editor.frame.frame.set({
      fill: '#ffffff',
    });

    this.context.canvas.discardActiveObject();
    this.context.state.setActiveObject(null);

    this.context.canvas.renderAll();

    this.context.updateContextObjects();
  };

  public reset = () => {
    const { background } =
      this.context.editor.frame;

    const objects =
      this.context.canvas
        .getObjects()
        .slice();

    objects.forEach((object) => {
      if (
        object.type !== LayerType.FRAME &&
        object.type !== LayerType.BACKGROUND
      ) {
        this.context.canvas.remove(object);
      }
    });

    background?.set({
      fill: '#ffffff',
    });

    this.context.canvas.discardActiveObject();
    this.context.state.setActiveObject(null);

    this.context.canvas.renderAll();

    this.context.editor.history.reset();

    this.context.updateContextObjects();
  };

  public remove = (id?: string) => {
    if (id) {
      const object =
        this.context.findOneById(id);

      if (object) {
        this.context.canvas.remove(object);
      }
    } else {
      const objects =
        this.context.canvas.getActiveObjects();

      objects.forEach((object) => {
        this.context.canvas.remove(object);
      });
    }

    this.context.canvas.discardActiveObject();
    this.context.state.setActiveObject(null);

    this.context.canvas.requestRenderAll();

    this.context.updateContextObjects();

    this.context.editor.history.save();
  };

  public removeById = (id: string) => {
    this.remove(id);
  };

  public removeByName = (name: string) => {
    let removed = false;

    this.context.canvas
      .getObjects()
      .forEach((object) => {
        if (object.name === name) {
          this.context.canvas.remove(object);
          removed = true;
        }
      });

    if (!removed) {
      return;
    }

    this.context.canvas.discardActiveObject();
    this.context.state.setActiveObject(null);

    this.context.canvas.requestRenderAll();

    this.context.updateContextObjects();

    this.context.editor.history.save();
  };
}

export default ObjectsManager;