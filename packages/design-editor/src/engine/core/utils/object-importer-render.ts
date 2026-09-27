import { Group, loadSVGFromURL } from 'fabric';

import { updateObjectShadow } from './fabric';
import { reviveFill } from './gradient';
import { loadImageFromURL } from './image-loader';
import {
  Background,
  BackgroundImage,
  StaticImage,
  StaticPath,
  StaticText,
  StaticVector,
} from '../../objects';
import { LayerType } from '../../types';

import type {
  FabricObject,
  TComplexPathData,
  TOriginX,
  TOriginY,
} from 'fabric';

import type { FontLoader } from './font-loader';
import type {
  IBackground,
  IBackgroundImage,
  IGroup,
  ILayer,
  IStaticImage,
  IStaticPath,
  IStaticText,
  IStaticVector,
} from '../../types';

class ObjectImporter {
  constructor(private readonly fonts: FontLoader) {}

  async import(item: any, params: any): Promise<FabricObject> {
    let object;
    switch (item.type) {
      case LayerType.STATIC_TEXT:
        object = await this.staticText(item);
        break;
      case LayerType.STATIC_IMAGE:
        object = await this.staticImage(item);
        break;
      case LayerType.BACKGROUND_IMAGE:
        object = await this.backgroundImage(item);
        break;
      case LayerType.STATIC_VIDEO:
        object = await this.staticVideo(item);
        break;
      case LayerType.STATIC_VECTOR:
        object = await this.staticVector(item);
        break;
      case LayerType.STATIC_PATH:
        object = await this.staticPath(item);
        break;
      case LayerType.BACKGROUND:
        object = await this.background(item);
        break;
      case LayerType.GROUP:
        object = await this.group(item, params);
        break;
    }
    return object as FabricObject;
  }

  public async staticText(item: ILayer): Promise<StaticText> {
    await this.fonts.ensure(item);

    return new Promise((resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { metadata } = item;
        const {
          textAlign,
          fontFamily,
          fontSize,
          fontWeight,
          fontStyle,
          charSpacing,
          lineHeight,
          text,
          underline,
          fill,
        } = item as IStaticText;

        const textOptions = {
          ...baseOptions,
          underline,
          width: baseOptions.width ? baseOptions.width : 240,
          text: text || 'Empty Text',
          fill: fill || '#333333',
          ...(textAlign && { textAlign: textAlign as any }),
          ...(fontFamily && { fontFamily }),
          ...(fontSize && { fontSize }),
          ...(fontWeight && { fontWeight }),
          ...(fontStyle && { fontStyle: fontStyle as any }),
          ...(charSpacing && { charSpacing }),
          ...(lineHeight && { lineHeight }),
          metadata,
        };
        const element = new StaticText(textOptions);

        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticImage(item: ILayer): Promise<StaticImage> {
    const baseOptions = this.getBaseOptions(item);
    const { src, cropX, cropY, cornerRadius } = item as IStaticImage;

    const image: any = await loadImageFromURL(src);
    const element = new StaticImage(image, {
      ...baseOptions,
      cropX: cropX || 0,
      cropY: cropY || 0,
      cornerRadius: cornerRadius ?? 0,
    });
    updateObjectShadow(element, item.shadow);

    return element;
  }

  public async backgroundImage(item: ILayer): Promise<BackgroundImage> {
    const baseOptions = this.getBaseOptions(item);
    const { src, cropX, cropY } = item as IBackgroundImage;

    const image: any = await loadImageFromURL(src);
    const element = new BackgroundImage(image, {
      ...baseOptions,
      cropX: cropX || 0,
      cropY: cropY || 0,
    });
    updateObjectShadow(element, item.shadow);

    return element;
  }

  public async staticVideo(item: ILayer): Promise<StaticImage> {
    const baseOptions = this.getBaseOptions(item);
    const { preview: src, cropX, cropY } = item as IStaticImage;

    const image: any = await loadImageFromURL(src as string);
    const element = new StaticImage(image, {
      ...baseOptions,
      cropX: cropX || 0,
      cropY: cropY || 0,
    });
    updateObjectShadow(element, item.shadow);

    return element;
  }

  public async staticPath(item: ILayer): Promise<StaticPath> {
    return new Promise((resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { path, fill } = item as IStaticPath;

        const element = new StaticPath({
          ...baseOptions,
          path: path as unknown as TComplexPathData,
          fill,
        });

        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async group(item: ILayer, params: any): Promise<Group> {
    const baseOptions = this.getBaseOptions(item);
    const objects = await Promise.all(
      (item as IGroup).objects.map(async (object) =>
        this.import(object, params)
      )
    );

    const element = new Group(objects, baseOptions);

    updateObjectShadow(element, item.shadow);

    return element;
  }

  public async background(item: ILayer): Promise<Background> {
    const baseOptions = this.getBaseOptions(item);
    const fill = reviveFill((item as IBackground).fill);
    return new Background({
      ...baseOptions,
      fill,
      id: 'background',
      name: '',
    });
  }

  public async staticVector(item: ILayer): Promise<StaticVector> {
    const baseOptions = this.getBaseOptions(item);
    const { src, colorMap = {} } = item as IStaticVector;

    const { objects, options: opts } = await loadSVGFromURL(src);
    const { width, height } = baseOptions;
    if (!width || !height) {
      baseOptions.width = opts.width;
      baseOptions.height = opts.height;
    }

    const element = new StaticVector(objects, opts, {
      ...baseOptions,
      src,
      colorMap,
    });

    updateObjectShadow(element, item.shadow);

    return element;
  }

  // eslint-disable-next-line class-methods-use-this -- pure option-mapping helper shared by every import method
  getBaseOptions(item: ILayer) {
    const {
      id,
      name,
      left,
      top,
      width,
      height,
      scaleX,
      scaleY,
      opacity,
      flipX,
      flipY,
      skewX,
      skewY,
      stroke,
      strokeWidth,
      originX,
      originY,
      angle,
    } = item;
    const metadata = item.metadata ? item.metadata : {};
    return {
      id,
      name,
      angle,
      top,
      left,
      width,
      height,
      originX: (originX || 'left') as TOriginX,
      originY: (originY || 'top') as TOriginY,
      scaleX: scaleX || 1,
      scaleY: scaleY || 1,
      opacity: opacity || 1,
      flipX: flipX || false,
      flipY: flipY || false,
      skewX: skewX || 0,
      skewY: skewY || 0,
      ...(stroke && { stroke }),
      strokeWidth: strokeWidth || 0,
      strokeDashArray: item.strokeDashArray ? item.strokeDashArray : null,
      strokeLineCap: (item.strokeLineCap
        ? item.strokeLineCap
        : 'butt') as CanvasLineCap,
      strokeLineJoin: (item.strokeLineJoin
        ? item.strokeLineJoin
        : 'miter') as CanvasLineJoin,
      strokeUniform: item.strokeUniform || false,
      strokeMiterLimit: item.strokeMiterLimit ? item.strokeMiterLimit : 4,
      strokeDashOffset: item.strokeDashOffset ? item.strokeMiterLimit : 0,
      metadata,
    };
  }
}

export default ObjectImporter;
