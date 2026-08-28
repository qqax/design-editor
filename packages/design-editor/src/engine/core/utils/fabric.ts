import { Gradient, Shadow } from 'fabric';
import { isNaN } from 'lodash';

import type { Object as FabricObject } from 'fabric';

import type { ILayer } from '../../types';
import type { ShadowOptions } from '../common/interfaces';

export function angleToPoint(angle: number, sx: number, sy: number) {
  while (angle < 0) angle += 360;
  angle %= 360;
  const a = sy;
  const b = a + sx;
  const c = b + sy;
  const p = (sx + sy) * 2;
  const rp = p * 0.00277;
  const pp = Math.round((angle * rp + (sy >> 1)) % p);

  if (pp <= a) return { x: 0, y: sy - pp };
  if (pp <= b) return { y: 0, x: pp - a };
  if (pp <= c) return { x: sx, y: pp - b };
  return { y: sy, x: sx - (pp - c) };
}

const setObjectGradient = (
  object: FabricObject,
  angle: number,
  colors: string[]
) => {
  const odx = object.width >> 1;
  const ody = object.height >> 1;
  const startPoint = angleToPoint(angle, object.width, object.height);
  const endPoint = {
    x: object.width - startPoint.x,
    y: object.height - startPoint.y,
  };

  object.set(
    'fill',
    new Gradient({
      type: 'linear',
      coords: {
        x1: startPoint.x - odx,
        y1: startPoint.y - ody,
        x2: endPoint.x - odx,
        y2: endPoint.y - ody,
      },
      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] },
      ],
    })
  );
};

export const setObjectShadow = (
  object: FabricObject | any,
  options: ShadowOptions
) => {
  if (options.enabled) {
    object.set({
      shadow: new Shadow(options as any),
    });
  } else {
    object.set({
      shadow: null,
    });
  }
};

export const updateObjectShadow = (
  object: FabricObject | any,
  options: any
) => {
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
  element: FabricObject | any,
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
