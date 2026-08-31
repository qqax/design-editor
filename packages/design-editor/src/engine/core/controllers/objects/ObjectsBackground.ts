import {
  BackgroundImage,
  StaticImage,
} from '../../../objects';

import { LayerType } from '../../../types';

import { generateId } from '../../utils/id';
import { loadImageFromURL } from '../../utils/image-loader';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsBackground {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  public unset = async (): Promise<StaticImage | null> => {
    const currentBackgroundImage = this.context.canvas
      .getObjects()
      .find(
        (object) =>
          object.type === LayerType.BACKGROUND_IMAGE,
      );

    if (!currentBackgroundImage) {
      return null;
    }

    const json = currentBackgroundImage.toObject(
      this.context.config.propertiesToInclude,
    ) as Record<string, any>;

    delete json.clipPath;

    const imageElement = await loadImageFromURL(json.src);

    const nextImage = new StaticImage(imageElement, {
      ...json,
      id: generateId(),
    });

    this.context.canvas.remove(
      currentBackgroundImage,
    );

    return nextImage;
  };

  public set = async (id?: string) => {
    const refObject = this.context.getRefObject(id);

    if (!refObject) {
      return;
    }

    if (refObject.type !== LayerType.STATIC_IMAGE) {
      return;
    }

    const { frame } = this.context.editor.frame;

    const previousBackground = await this.unset();

    if (previousBackground) {
      this.context.canvas.add(previousBackground);
    }

    const objectJSON = refObject.toObject(
      this.context.config.propertiesToInclude,
    ) as Record<string, any>;

    delete objectJSON.clipPath;

    const imageElement = await loadImageFromURL(
      objectJSON.src,
    );

    const backgroundImage = new BackgroundImage(
      imageElement,
      {
        ...objectJSON,
        id: generateId(),
      },
    );

    this.context.canvas.add(backgroundImage);

    backgroundImage.clipPath = frame as any;

    this.context.canvas.remove(refObject);

    this.context.editor.objects.scale(
      'fill',
      backgroundImage.id,
    );

    this.context.canvas.moveObjectTo(
      backgroundImage,
      2,
    );

    if (previousBackground) {
      this.context.editor.objects.sendToBack(
        previousBackground.id,
      );
    }

    this.context.canvas.discardActiveObject();
    this.context.canvas.requestRenderAll();

    this.context.updateContextObjects();
    this.context.editor.history.save();
  };
}

export default ObjectsBackground;