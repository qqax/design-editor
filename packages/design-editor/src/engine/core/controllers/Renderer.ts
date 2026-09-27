/* eslint-disable no-console */
import { config, StaticCanvas } from 'fabric';

import { fontLoader } from '../utils/font-loader';
import ObjectImporter from '../utils/object-importer-render';

import type { ILayer, IScene } from '../../types';

function collectFontPaths(
  layers: readonly Partial<ILayer>[]
): Record<string, string> {
  return layers.reduce<Record<string, string>>((paths, layer) => {
    const nested =
      'objects' in layer && Array.isArray(layer.objects)
        ? collectFontPaths(layer.objects)
        : {};
    const own =
      'fontFamily' in layer &&
      'fontURL' in layer &&
      layer.fontFamily &&
      layer.fontURL
        ? { [layer.fontFamily]: layer.fontURL }
        : {};
    return { ...paths, ...nested, ...own };
  }, {});
}

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

  /** Renders the scene at `multiplier` × its frame size */
  public async toCanvasElement(
    template: IScene,
    multiplier = 1
  ): Promise<HTMLCanvasElement> {
    const staticCanvas = new StaticCanvas();
    try {
      await this.loadTemplate(staticCanvas, template, {});
      return staticCanvas.toCanvasElement(multiplier);
    } finally {
      void staticCanvas.dispose();
    }
  }

  /** Vector export; fonts with a `fontURL` are declared via @font-face, `css` goes into <defs> */
  public async toSVG(template: IScene, css?: string): Promise<string> {
    const staticCanvas = new StaticCanvas();
    const fonts = collectFontPaths(template.layers);
    try {
      await this.loadTemplate(staticCanvas, template, {});
      config.addFonts(fonts);
      const svg = staticCanvas.toSVG();
      return css
        ? svg.replace(
            '<defs>',
            `<defs>\n<style type="text/css"><![CDATA[\n${css}\n]]></style>`
          )
        : svg;
    } finally {
      config.removeFonts(Object.keys(fonts));
      void staticCanvas.dispose();
    }
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

    // Imports finish in any order; adding them afterwards keeps the z-order.
    const elements = await Promise.all(
      template.layers.map(async (layer) =>
        objectImporter.import(layer, params).catch((err: unknown) => {
          console.error('ERROR LOADING LAYER: ', layer, err);
          return null;
        })
      )
    );

    elements.forEach((element, index) => {
      if (element) staticCanvas.add(element);
      else console.log('UNABLE TO LOAD LAYER: ', template.layers[index]);
    });

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
