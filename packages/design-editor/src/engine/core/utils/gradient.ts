import { Gradient } from 'fabric';

import type { TFiller } from 'fabric';

import type { GradientFill, GradientStop } from '../common/interfaces';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function normalizeStops(stops: GradientStop[]): GradientStop[] {
  return stops
    .map(({ offset, color }) => ({ offset: clamp01(offset), color }))
    .sort((a, b) => a.offset - b.offset);
}

/** Coordinates are relative to the object's top-left corner, as Fabric expects. */
export function createGradient(
  width: number,
  height: number,
  { type, angle, stops }: GradientFill
): Gradient<'linear'> | Gradient<'radial'> {
  const colorStops = normalizeStops(stops);
  const cx = width / 2;
  const cy = height / 2;

  if (type === 'radial') {
    return new Gradient({
      type: 'radial',
      coords: {
        x1: cx,
        y1: cy,
        r1: 0,
        x2: cx,
        y2: cy,
        r2: Math.hypot(width, height) / 2,
      },
      colorStops,
    });
  }

  // CSS semantics: 0deg points up, 90deg points right
  const radians = (angle * Math.PI) / 180;
  const dx = Math.sin(radians);
  const dy = -Math.cos(radians);
  const half = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
  return new Gradient({
    type: 'linear',
    coords: {
      x1: cx - dx * half,
      y1: cy - dy * half,
      x2: cx + dx * half,
      y2: cy + dy * half,
    },
    colorStops,
  });
}

export function gradientToCss({ type, angle, stops }: GradientFill): string {
  const colorStops = normalizeStops(stops)
    .map(({ color, offset }) => `${color} ${Math.round(offset * 100)}%`)
    .join(', ');
  return type === 'radial'
    ? `radial-gradient(circle farthest-corner, ${colorStops})`
    : `linear-gradient(${angle}deg, ${colorStops})`;
}

export function isGradientFill(value: unknown): value is GradientFill {
  if (typeof value !== 'object' || value === null) return false;
  const { type, stops } = value as Partial<GradientFill>;
  return (type === 'linear' || type === 'radial') && Array.isArray(stops);
}

/** Turns a serialized Fabric gradient (e.g. from `toObject`) back into a Gradient. */
export function reviveFill(fill: unknown): string | TFiller | undefined {
  if (typeof fill === 'string') return fill;
  if (fill instanceof Gradient) return fill as TFiller;
  if (typeof fill !== 'object' || fill === null) return undefined;
  const serialized = fill as Partial<
    ConstructorParameters<typeof Gradient<'linear' | 'radial'>>[0]
  >;
  const { type, colorStops, coords } = serialized;
  if ((type !== 'linear' && type !== 'radial') || !colorStops || !coords) {
    return undefined;
  }
  return new Gradient<'linear' | 'radial'>({
    ...serialized,
    type,
    colorStops,
    coords,
  }) as TFiller;
}
