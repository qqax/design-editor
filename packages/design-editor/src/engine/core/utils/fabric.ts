import { Shadow } from 'fabric';
import { isNaN } from 'lodash';

import { createGradient } from './gradient';

import type { FabricObject } from 'fabric';

import type { ILayer } from '../../types';
import type { GradientFill, ShadowOptions } from '../common/interfaces';

const setObjectGradient = (object: FabricObject, gradient: GradientFill) => {
  object.set('fill', createGradient(object.width, object.height, gradient));
};

export const setObjectShadow = (
  object: FabricObject,
  options: ShadowOptions
) => {
  if (options.enabled) {
    object.set({
      shadow: new Shadow(options),
    });
  } else {
    object.set({
      shadow: null,
    });
  }
};

export const updateObjectShadow = (object: FabricObject, options: any) => {
  if (options) {
    object.set({
      shadow: new Shadow(options),
    });
  } else {
    object.set({
      shadow: null,
    });
  }
};

export const updateObjectBounds = (
  element: FabricObject,
  options: Required<ILayer>
) => {
  const { top, left, width, height } = element;
  if (isNaN(top) || isNaN(left)) {
    element.set({
      top: options.top + options.height / 2 - height / 2,
      left: options.left + options.width / 2 - width / 2,
    });
  }
};

export default setObjectGradient;
