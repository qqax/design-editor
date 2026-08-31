import { LayerType } from '../../../types';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsLayers {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  private save = () => {
    this.context.updateContextObjects();
    this.context.editor.history.save();
  };

  public bringForward = (id?: string) => {
    const object = this.context.getRefObject(id);

    if (!object) {
      return;
    }

    this.context.canvas.bringObjectForward(object);
    this.context.canvas.requestRenderAll();

    this.save();
  };

  public bringForwardById = (id: string) => {
    const object = this.context.findOneById(id);

    if (!object) {
      return;
    }

    this.context.canvas.bringObjectForward(object);
    this.context.canvas.requestRenderAll();

    this.save();
  };

  public bringToFront = (id?: string) => {
    const object = this.context.getRefObject(id);

    if (!object) {
      return;
    }

    this.context.canvas.bringObjectToFront(object);
    this.context.canvas.requestRenderAll();

    this.save();
  };

  private getMinimumIndex = () => {
    const hasBackgroundImage = this.context.canvas
      .getObjects()
      .some(
        (object) =>
          object.type === LayerType.BACKGROUND_IMAGE,
      );

    return hasBackgroundImage ? 3 : 2;
  };

  public sendBackwards = (id?: string) => {
    const object = this.context.getRefObject(id);

    if (!object) {
      return;
    }

    const objects = this.context.canvas.getObjects();
    const index = objects.indexOf(object);
    const minimumIndex = this.getMinimumIndex();

    if (index <= minimumIndex) {
      return;
    }

    this.context.canvas.sendObjectBackwards(object);
    this.context.canvas.requestRenderAll();

    this.save();
  };

  public sendToBack = (id?: string) => {
    const object = this.context.getRefObject(id);

    if (!object) {
      return;
    }

    const hasBackgroundImage = this.context.canvas
      .getObjects()
      .some(
        (item) =>
          item.type === LayerType.BACKGROUND_IMAGE,
      );

    this.context.canvas.moveObjectTo(
      object,
      hasBackgroundImage ? 3 : 2,
    );

    this.context.canvas.requestRenderAll();

    this.save();
  };
}

export default ObjectsLayers;