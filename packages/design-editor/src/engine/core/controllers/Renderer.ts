/* eslint-disable no-console */
import { StaticCanvas } from 'fabric';

import { fontLoader } from '../utils/font-loader';
import ObjectImporter from '../utils/object-importer-render';

import type { ILayer, IScene } from '../../types';

class Renderer {
  public async render(template: IScene) {
    return this.toDataURL(template, {});
  }

  public async toDataURL(
    template: IScene,
    params: Record<string, any>
  ): Promise<string> {
    const staticCanvas = new StaticCanvas();

    if (params.backgroundColor) {
      staticCanvas.backgroundColor = params.backgroundColor;
    }

    await this.loadTemplate(staticCanvas, template, params);

    const { format = 'webp', quality = 1, multiplier = 1 } = params;

    const mappedFormat =
      format === 'webp' || format === 'image/webp' ? 'image/webp' : format;

    return staticCanvas.toDataURL({
      format: mappedFormat,
      quality,
      multiplier,
      top: 0,
      left: 0,
      height: staticCanvas.getHeight(),
      width: staticCanvas.getWidth(),
    });
  }

  public renderLayer = async (
    layer: Required<ILayer>,
    params: object
  ): Promise<string> => {
    const staticCanvas = new StaticCanvas();

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

    return staticCanvas.toDataURL({
      multiplier: 1,
      top: 0,
      left: 0,
      height: staticCanvas.getHeight(),
      width: staticCanvas.getWidth(),
    });
  };

  private async loadTemplate(
    staticCanvas: StaticCanvas,
    template: IScene,
    params: Record<string, any>
  ): Promise<void> {
    const { frame } = template;
    this.setDimensions(staticCanvas, frame);

    // Text is measured as it is built, so every face must be ready up front.
    await fontLoader.ensure(template);

    const objectImporter = new ObjectImporter();

    const importPromises = template.layers.map(async (layer) =>
      objectImporter
        .import(layer, params)
        .then((element) => {
          if (element) {
            staticCanvas.add(element);
          } else {
            console.log('UNABLE TO LOAD LAYER: ', layer);
          }
        })
        .catch((err) => {
          console.error('ERROR LOADING LAYER: ', layer, err);
        })
    );

    await Promise.all(importPromises);

    staticCanvas.renderAll();
  }

  // eslint-disable-next-line class-methods-use-this
  private setDimensions(
    staticCanvas: StaticCanvas,
    { width, height }: { width: number; height: number }
  ) {
    staticCanvas.setDimensions({ width, height });
  }
}

export default Renderer;
