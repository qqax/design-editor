import {StaticCanvas,} from 'fabric';

import ObjectImporter from '../utils/object-importer-render';

import type {ILayer, IScene} from '../../types';

class Renderer {
  public async render(template: IScene) {
    return this.toDataURL(template, {});
  }

  public async toDataURL(template: IScene, params: Record<string, any>) {
    return new Promise(async (resolve, reject) => {
      // @ts-ignore
      const staticCanvas = new StaticCanvas(null);
      if (params.backgroundColor) {
        staticCanvas.backgroundColor = params.backgroundColor;
      }
      await this.loadTemplate(staticCanvas, template, params);
      const { format = 'png', quality = 1, multiplier = 1 } = params;
      const data = staticCanvas.toDataURL({
        format,
        quality,
        multiplier,
        top: 0,
        left: 0,
        height: staticCanvas.height,
        width: staticCanvas.width,
      });
      resolve(data);
    });
  }

  public renderLayer = async (layer: Required<ILayer>, params: {}) => {
    return new Promise(async (resolve, reject) => {
      // @ts-ignore
      const staticCanvas = new StaticCanvas(null);
      await this.loadTemplate(
        staticCanvas,
        {
          id: layer.id,
          metadata: {},
          layers: [{ ...layer, top: 0, left: 0 }],
          frame: {
            width: layer.width * layer.scaleX,
            height: layer.height * layer.scaleY,
          },
        },
        params
      );
      const data = staticCanvas.toDataURL({
        multiplier: 1,
        top: 0,
        left: 0,
        height: staticCanvas.height,
        width: staticCanvas.width,
      });
      resolve(data);
    });
  };

  // @ts-ignore
  private async loadTemplate(
    staticCanvas: StaticCanvas,
    template: IScene,
    params: Record<string, any>
  ) {
    const { frame } = template;
    this.setDimensions(staticCanvas, frame);
    const objectImporter = new ObjectImporter();

    for (const layer of template.layers) {
      const element = await objectImporter.import(layer, params);
      if (element) {
        staticCanvas.add(element);
      } else {
        console.log('UNABLE TO LOAD LAYER: ', layer);
      }
    }
  }

  // @ts-ignore
  private setDimensions(
    staticCanvas: StaticCanvas,
    { width, height }: { width: number; height: number }
  ) {
    staticCanvas.setDimensions({ width, height });
  }
}

export default Renderer;
