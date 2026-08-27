import type { Object as FabricObject} from "fabric";
import { loadSVGFromURL, Canvas, Group, util  } from "fabric";

import { updateObjectShadow } from "./fabric"
import { loadImageFromURL } from "./image-loader"
import { Background } from '../../objects/Background';
import { BackgroundImage } from '../../objects/BackgroundImage';
import { StaticAudio } from '../../objects/StaticAudio';
import { StaticImage } from '../../objects/StaticImage';
import { StaticPath } from '../../objects/StaticPath';
import { StaticText } from '../../objects/StaticText';
import { StaticVector } from '../../objects/StaticVector';
import { StaticVideo } from '../../objects/StaticVideo';
import { LayerType } from '../common/constants';

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
    return new Promise((resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { metadata } = item;
        const {
          textAlign,
          fontFamily,
          fontSize,
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
          ...(textAlign && { textAlign }),
          ...(fontFamily && { fontFamily }),
          ...(fontSize && { fontSize }),
          ...(charSpacing && { charSpacing }),
          ...(lineHeight && { lineHeight }),
          metadata,
        };
        // @ts-ignore
        const element = new StaticText(textOptions);

        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticImage(item: ILayer): Promise<StaticImage> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { src, cropX, cropY } = item as IStaticImage;

        const image: any = await loadImageFromURL(src);
        const element = new StaticImage(image, {
          ...baseOptions,
          cropX: cropX || 0,
          cropY: cropY || 0,
        });
        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async backgroundImage(item: ILayer): Promise<BackgroundImage> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { src, cropX, cropY } = item as IBackgroundImage;

        const image: any = await loadImageFromURL(src);
        const element = new BackgroundImage(image, {
          ...baseOptions,
          cropX: cropX || 0,
          cropY: cropY || 0,
        });
        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticVideo(item: ILayer): Promise<StaticImage> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { preview: src, cropX, cropY } = item as IStaticImage;

        const image: any = await loadImageFromURL(src as string);
        const element = new StaticImage(image, {
          ...baseOptions,
          cropX: cropX || 0,
          cropY: cropY || 0,
        });
        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticPath(item: ILayer): Promise<StaticPath> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { path, fill } = item as IStaticPath;

        const element = new StaticPath({
          ...baseOptions,
          // @ts-ignore
          path,
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
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        let objects: FabricObject[] = [];

        for (const object of (item as IGroup).objects) {
          objects = objects.concat(await this.import(object, params));
        }
        // @ts-ignore
        const element = new Group(objects, baseOptions);

        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async background(item: ILayer): Promise<Background> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { fill } = item as IBackground;
        // @ts-ignore
        const element = new Background({
          ...baseOptions,
          fill,
          id: 'background',
          name: '',
        });

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticVector(item: ILayer): Promise<StaticVector> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item);
        const { src, colorMap = {} } = item as IStaticVector;

        loadSVGFromURL(src, (objects, opts) => {
          const { width, height } = baseOptions;
          if (!width || !height) {
            baseOptions.width = opts.width;
            baseOptions.height = opts.height;
          }

          // @ts-ignore
          const element = new StaticVector(objects, opts, {
            ...baseOptions,
            src,
            colorMap,
          });

          updateObjectShadow(element, item.shadow);

          resolve(element);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

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
    const baseOptions = {
      id,
      name,
      angle,
      top,
      left,
      width,
      height,
      originX: originX || 'left',
      originY: originY || 'top',
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
      strokeLineCap: item.strokeLineCap ? item.strokeLineCap : 'butt',
      strokeLineJoin: item.strokeLineJoin ? item.strokeLineJoin : 'miter',
      strokeUniform: item.strokeUniform || false,
      strokeMiterLimit: item.strokeMiterLimit ? item.strokeMiterLimit : 4,
      strokeDashOffset: item.strokeDashOffset ? item.strokeMiterLimit : 0,
      metadata,
    };
    return baseOptions;
  }
}

export default ObjectImporter;
