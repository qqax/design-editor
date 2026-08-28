import type {Object as FabricObject} from 'fabric';
import {Group, loadSVGFromURL} from 'fabric';

import {updateObjectBounds, updateObjectShadow} from './fabric';
import {generateId} from './id';
import {loadImageFromURL} from './image-loader';
import {createVideoElement} from './video-loader';
import {Background} from '../../objects/Background';
import {BackgroundImage} from '../../objects/BackgroundImage';
import {StaticAudio} from '../../objects/StaticAudio';
import {StaticImage} from '../../objects/StaticImage';
import {StaticText} from '../../objects/StaticText';
import {StaticPath} from '../../objects/StaticPath';
import {StaticVector} from '../../objects/StaticVector';
import {StaticVideo} from '../../objects/StaticVideo';

import {LayerType} from '../common/constants';

import type {
  IBackground,
  IBackgroundImage,
  IGroup,
  ILayer,
  IStaticAudio,
  IStaticImage,
  IStaticPath,
  IStaticText,
  IStaticVector,
  IStaticVideo,
} from '../../types';
import type {Editor} from '../editor';


class ObjectImporter {
  constructor(public editor: Editor) {}

  async import(
    item: ILayer,
    options: Required<ILayer>,
    inGroup = false
  ): Promise<FabricObject> {
    let object: FabricObject;
    switch (item.type) {
      case LayerType.STATIC_TEXT:
        object = await this.staticText(item, options, inGroup);
        break;
      case LayerType.STATIC_IMAGE:
        // @ts-ignore
        object = await this.staticImage(item, options, inGroup);
        break;
      case LayerType.BACKGROUND_IMAGE:
        // @ts-ignore
        object = await this.backgroundImage(item, options, inGroup);
        break;
      case LayerType.STATIC_VIDEO:
        object = await this.staticVideo(item, options, inGroup);
        break;
      case LayerType.STATIC_VECTOR:
        // @ts-ignore
        object = await this.staticVector(item, options, inGroup);
        break;
      case LayerType.STATIC_PATH:
        object = await this.staticPath(item, options, inGroup);
        break;
      case LayerType.BACKGROUND:
        object = await this.background(item, options, inGroup);
        break;
      case LayerType.GROUP:
        object = await this.group(item, options, inGroup);
        break;
      case LayerType.STATIC_AUDIO:
        object = await this.staticAudio(item, options, inGroup);
        break;
      default:
        object = await this.background(item, options, inGroup);
    }
    return object;
  }

  public async staticText(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticText> {
    return new Promise((resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);

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
          fontURL,
        } = item as IStaticText;

        const textOptions = {
          ...baseOptions,
          underline,
          width: baseOptions.width ? baseOptions.width : 240,
          fill: fill || '#333333',
          text: text || 'Empty Text',
          ...(textAlign && { textAlign }),
          ...(fontFamily && { fontFamily }),
          ...(fontSize && { fontSize }),
          ...(charSpacing && { charSpacing }),
          ...(lineHeight && { lineHeight }),
          metadata,
          fontURL,
        };
        // @ts-ignore
        const element = new StaticText(textOptions);
        updateObjectBounds(element, options);
        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticImage(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticImage> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        const { src, cropX, cropY } = item as IStaticImage;

        const image: any = await loadImageFromURL(src);

        const { width, height } = baseOptions;
        if (!width || !height) {
          baseOptions.width = image.width;
          baseOptions.height = image.height;
        }

        const element = new StaticImage(image, {
          ...baseOptions,
          cropX: cropX || 0,
          cropY: cropY || 0,
        });

        updateObjectBounds(element, options);
        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async backgroundImage(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<BackgroundImage> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        const { src, cropX, cropY } = item as IBackgroundImage;

        const image: any = await loadImageFromURL(src);

        const { width, height } = baseOptions;
        if (!width || !height) {
          baseOptions.width = image.width;
          baseOptions.height = image.height;
        }

        const element = new BackgroundImage(image, {
          ...baseOptions,
          cropX: cropX || 0,
          cropY: cropY || 0,
        });

        updateObjectBounds(element, options);
        // updateObjectShadow(element, item.shadow)

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticVideo(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<FabricObject> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        const { src } = item as IStaticVideo;
        const { id } = item;
        const videoElement = await createVideoElement(id, src);
        const { width, height } = baseOptions;

        if (!width || !height) {
          baseOptions.width = videoElement.videoWidth;
          baseOptions.height = videoElement.videoHeight;
        }

        const element = new StaticVideo(videoElement, {
          ...baseOptions,
          src,
          duration: videoElement.duration,
          totalDuration: videoElement.duration,
        }) as unknown as any;

        element.set('time', 10);
        videoElement.currentTime = 10;
        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticAudio(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticAudio> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        const { src } = item as IStaticAudio;
        // @ts-ignore
        const element = new StaticAudio({
          ...baseOptions,
          src,
        });
        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticPath(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticPath> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        const { path, fill } = item as IStaticPath;

        const element = new StaticPath({
          ...baseOptions,
          // @ts-ignore
          path,
          fill,
        });

        updateObjectBounds(element, options);
        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async group(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<Group> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        let objects: FabricObject[] = [];

        for (const object of (item as IGroup).objects) {
          // @ts-ignore
          objects = objects.concat(await this.import(object, options, true));
        }
        // @ts-ignore
        const element = new Group(objects, {
          ...baseOptions,
          subTargetCheck: true,
        });

        updateObjectBounds(element, options);
        updateObjectShadow(element, item.shadow);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async background(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<Background> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        const { fill } = item as IBackground;
        // @ts-ignore
        const element = new Background({
          ...baseOptions,
          fill,
          // @ts-ignore
          shadow: item.shadow,
        });

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async staticVector(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticVector> {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);
        const { src, colorMap = {} } = item as IStaticVector;

        loadSVGFromURL(src)
          .then(({ objects, options: opts }) => {
            const { width, height } = baseOptions;
            if (!width || !height) {
              baseOptions.width = opts.width;
              baseOptions.height = opts.height;
              baseOptions.top = options.top;
              baseOptions.left = options.left;
            }

            // @ts-ignore
            const element = new StaticVector(objects, opts, {
              ...baseOptions,
              src,
              colorMap,
            });

            updateObjectBounds(element, options);
            updateObjectShadow(element, item.shadow);

            resolve(element);
          })
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  public getBaseOptions(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ) {
    const {
      id,
      name,
      left,
      top,
      width,
      height,
      scaleX,
      scaleY,
      stroke,
      strokeWidth,
      opacity,
      angle,
      flipX,
      flipY,
      skewX,
      skewY,
      originX,
      originY,
      type,
      shadow,
      preview,
    } = item as Required<ILayer>;

    let frameLeft = options.left;
    let frameTop = options.top;
    if (!inGroup) {
      if (options.originX === 'center')
        frameLeft -= (options.width * (options.scaleX || 1)) / 2;
      else if (options.originX === 'right')
        frameLeft -= options.width * (options.scaleX || 1);

      if (options.originY === 'center')
        frameTop -= (options.height * (options.scaleY || 1)) / 2;
      else if (options.originY === 'right')
        frameTop -= options.height * (options.scaleY || 1);
    }

    const metadata = item.metadata ? item.metadata : {};
    const { fill } = metadata;
    const baseOptions = {
      id: id || generateId(),
      name: name || type,
      angle: angle || 0,
      top: inGroup ? top : frameTop + top,
      left: inGroup ? left : frameLeft + left,
      width,
      height,
      originX: originX || 'left',
      originY: originY || 'top',
      scaleX: scaleX || 1,
      scaleY: scaleY || 1,
      fill: fill || '#000000',
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
      preview,
    };
    return baseOptions;
  }
}

export default ObjectImporter;
