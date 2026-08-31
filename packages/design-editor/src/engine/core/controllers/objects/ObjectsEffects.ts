import { Group } from 'fabric';

import { LayerType } from '../../../types';

import {
  GradientOptions,
  ShadowOptions,
} from '../../common/interfaces';

import setObjectGradient, {
  setObjectShadow,
} from '../../utils/fabric';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsEffects {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  private forActiveObject = (
    callback: (object: any) => void,
  ) => {
    const activeObject =
      this.context.canvas.getActiveObject();

    if (!activeObject) {
      return false;
    }

    if (
      activeObject instanceof Group &&
      activeObject.type !== LayerType.STATIC_VECTOR
    ) {
      activeObject
        .getObjects()
        .forEach(callback);
    } else {
      callback(activeObject);
    }

    return true;
  };

  public setShadow = (
    options: ShadowOptions,
  ) => {
    const changed = this.forActiveObject(
      (object) => {
        setObjectShadow(object, options);
      },
    );

    if (!changed) {
      return;
    }

    this.context.canvas.requestRenderAll();
    this.context.editor.history.save();
  };

  public setGradient = ({
                          angle,
                          colors,
                        }: GradientOptions) => {
    const changed = this.forActiveObject(
      (object) => {
        setObjectGradient(
          object,
          angle,
          colors,
        );
      },
    );

    if (!changed) {
      return;
    }

    this.context.canvas.requestRenderAll();
    this.context.editor.history.save();
  };
}

export default ObjectsEffects;