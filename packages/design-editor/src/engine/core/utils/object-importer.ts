import { Group, loadSVGFromURL } from 'fabric';

import { updateObjectBounds, updateObjectShadow } from './fabric';
import { fontLoader } from './font-loader';
import { reviveFill } from './gradient';
import { generateId } from './id';
import { loadImageFromURL } from './image-loader';
import { createLayerName } from './layer-name';
import { createVideoElement } from './video-loader';
import {
  Background,
  BackgroundImage,
  StaticAudio,
  StaticImage,
  StaticPath,
  StaticText,
  StaticVector,
  StaticVideo,
} from '../../objects';
import { LayerType } from '../../types';

import type {
  FabricObject,
  TComplexPathData,
  TOriginX,
  TOriginY,
} from 'fabric';

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
import type { Editor } from '../editor';

class ObjectImporter {
  constructor(public editor: Editor) {}

  private takenNames: Set<string> | null = null;

  private uniqueName(type: string, name: string | undefined): string {
    if (type === LayerType.BACKGROUND) return 'Background';
    if (!this.takenNames) {
      const collect = (objects: FabricObject[]): string[] =>
        objects.flatMap((object) => [
          ...(typeof object.name === 'string' ? [object.name] : []),
          ...(object instanceof Group ? collect(object.getObjects()) : []),
        ]);
      this.takenNames = new Set(
        collect(this.editor.canvas.canvas.getObjects())
      );
    }
    const unique = createLayerName(type, name, this.takenNames);
    this.takenNames.add(unique);
    return unique;
  }

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
        object = await this.staticImage(item, options, inGroup);
        break;
      case LayerType.BACKGROUND_IMAGE:
        object = await this.backgroundImage(item, options, inGroup);
        break;
      case LayerType.STATIC_VIDEO:
        object = await this.staticVideo(item, options, inGroup);
        break;
      case LayerType.STATIC_VECTOR:
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
      case LayerType.STATIC_GROUP:
      case LayerType.DYNAMIC_GROUP:
      case LayerType.DYNAMIC_PATH:
      case LayerType.DYNAMIC_IMAGE:
      case LayerType.DYNAMIC_TEXT:
      case LayerType.FRAME:
      case LayerType.ACTIVE_SELECTION:
      case LayerType.PRINT_ITEM:
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
    await fontLoader.ensure(item);

    return new Promise((resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, options, inGroup);

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
          fontURL,
        } = item as IStaticText;

        const textOptions = {
          ...baseOptions,
          underline,
          width: baseOptions.width ? baseOptions.width : 240,
          fill: fill || '#333333',
          text: text || 'Empty Text',
          ...(textAlign && { textAlign: textAlign as any }),
          ...(fontFamily && { fontFamily }),
          ...(fontSize && { fontSize }),
          ...(fontWeight && { fontWeight }),
          ...(fontStyle && { fontStyle: fontStyle as any }),
          ...(charSpacing && { charSpacing }),
          ...(lineHeight && { lineHeight }),
          metadata,
          fontURL,
        };
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
    const baseOptions = this.getBaseOptions(item, options, inGroup);
    const { src, cropX, cropY, cornerRadius } = item as IStaticImage;

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
      cornerRadius: cornerRadius ?? 0,
    });

    updateObjectBounds(element, options);
    updateObjectShadow(element, item.shadow);

    return element;
  }

  public async backgroundImage(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<BackgroundImage> {
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

    return element;
  }

  public async staticVideo(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<FabricObject> {
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
    return element as FabricObject;
  }

  public async staticAudio(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticAudio> {
    const baseOptions = this.getBaseOptions(item, options, inGroup);
    const { src } = item as IStaticAudio;
    return new StaticAudio({
      ...baseOptions,
      src,
    });
  }

  public async staticPath(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticPath> {
    const baseOptions = this.getBaseOptions(item, options, inGroup);
    const { path, fill } = item as IStaticPath;

    const element = new StaticPath({
      ...baseOptions,
      path: path as unknown as TComplexPathData,
      fill,
    });

    updateObjectBounds(element, options);
    updateObjectShadow(element, item.shadow);

    return element;
  }

  public async group(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<Group> {
    const baseOptions = this.getBaseOptions(item, options, inGroup);
    const objects = await Promise.all(
      (item as IGroup).objects.map(async (object) =>
        this.import(object, options, true)
      )
    );

    const element = new Group(objects, {
      ...baseOptions,
      subTargetCheck: true,
    });

    updateObjectBounds(element, options);
    updateObjectShadow(element, item.shadow);

    return element;
  }

  public async background(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<Background> {
    const baseOptions = this.getBaseOptions(item, options, inGroup);
    const fill = reviveFill((item as IBackground).fill);
    return new Background({
      ...baseOptions,
      fill,
      shadow: item.shadow as any,
    });
  }

  public async staticVector(
    item: ILayer,
    options: Required<ILayer>,
    inGroup: boolean
  ): Promise<StaticVector> {
    const baseOptions = this.getBaseOptions(item, options, inGroup);
    const { src, colorMap = {} } = item as IStaticVector;

    const { objects, options: opts } = await loadSVGFromURL(src);
    const { width, height } = baseOptions;
    if (!width || !height) {
      baseOptions.width = opts.width;
      baseOptions.height = opts.height;
      baseOptions.top = options.top;
      baseOptions.left = options.left;
    }

    const element = new StaticVector(objects, opts, {
      ...baseOptions,
      src,
      colorMap,
    });

    updateObjectBounds(element, options);
    updateObjectShadow(element, item.shadow);

    return element;
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
      else if (options.originY === 'bottom')
        frameTop -= options.height * (options.scaleY || 1);
    }

    const metadata = item.metadata ? item.metadata : {};
    const { fill } = metadata as { fill?: string };
    return {
      id: id || generateId(),
      name: this.uniqueName(type, name),
      angle: angle || 0,
      top: inGroup ? top : frameTop + top,
      left: inGroup ? left : frameLeft + left,
      width,
      height,
      originX: (originX || 'left') as TOriginX,
      originY: (originY || 'top') as TOriginY,
      scaleX: scaleX || 1,
      scaleY: scaleY || 1,
      fill: fill || '#000000',
      opacity: opacity ?? 1,
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
      preview,
    };
  }
}

export default ObjectImporter;
