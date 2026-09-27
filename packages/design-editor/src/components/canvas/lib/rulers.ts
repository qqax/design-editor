import type { GuideAxis, PageOffsets, SettingsType } from '../../../engine';

export const RULER_SIZE = 20;

const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];

/** Labelled tick interval (in frame units) that keeps labels at least `minPx` apart. */
export function pickRulerStep(zoom: number, minPx = 60): number {
  return STEPS.find((step) => step * zoom >= minPx) ?? STEPS[STEPS.length - 1];
}

export type RulerOrigin = SettingsType['rulerOrigin'];
export type RulerSides = SettingsType['rulerSides'];

/** Frame coordinate where the ruler along `axis` reads 0. */
export function rulerZero(
  axis: GuideAxis,
  origin: RulerOrigin,
  offsets: PageOffsets,
  frameSize: { width: number; height: number }
): number {
  if (axis === 'x') {
    return origin.x === 'left' ? offsets.left : frameSize.width - offsets.right;
  }
  return origin.y === 'top' ? offsets.top : frameSize.height - offsets.bottom;
}

/** +1 when ruler values grow with the frame coordinate, -1 otherwise. */
export function rulerSign(axis: GuideAxis, origin: RulerOrigin): 1 | -1 {
  if (axis === 'x') return origin.x === 'left' ? 1 : -1;
  return origin.y === 'top' ? 1 : -1;
}

export interface ScreenRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

/**
 * Rulers sit just outside the chosen frame edges and stick to the edge of the
 * visible area when a frame edge is scrolled out of view.
 */
export function placeRulers(
  frame: ScreenRect,
  visible: ScreenRect,
  sides: RulerSides
): { top: number; left: number } {
  const top = clamp(
    sides.horizontal === 'top' ? frame.top - RULER_SIZE : frame.bottom,
    visible.top,
    visible.bottom - RULER_SIZE
  );
  const left = clamp(
    sides.vertical === 'left' ? frame.left - RULER_SIZE : frame.right,
    visible.left,
    visible.right - RULER_SIZE
  );
  return { top, left };
}

/** The sides whose quadrant of `visible` contains the point. */
export function sidesAt(x: number, y: number, visible: ScreenRect): RulerSides {
  return {
    horizontal: y < (visible.top + visible.bottom) / 2 ? 'top' : 'bottom',
    vertical: x < (visible.left + visible.right) / 2 ? 'left' : 'right',
  };
}

export interface RulerColors {
  background: string;
  tick: string;
  text: string;
  border: string;
}

/**
 * Draws a ruler along `axis`. `zero` is where the value 0 falls, measured
 * from the start of the ruler in CSS pixels; values grow in `sign` direction.
 */
export function drawRuler(
  ctx: CanvasRenderingContext2D,
  axis: GuideAxis,
  length: number,
  zero: number,
  zoom: number,
  sign: 1 | -1,
  colors: RulerColors
) {
  const step = pickRulerStep(zoom);
  const minor = step / (step % 5 === 0 ? 5 : 2);
  const toScreen = (value: number) => zero + sign * value * zoom;
  const ends = [-zero / (sign * zoom), (length - zero) / (sign * zoom)];

  ctx.fillStyle = colors.background;
  if (axis === 'x') ctx.fillRect(0, 0, length, RULER_SIZE);
  else ctx.fillRect(0, 0, RULER_SIZE, length);

  ctx.strokeStyle = colors.tick;
  ctx.fillStyle = colors.text;
  ctx.lineWidth = 1;
  ctx.font = '9px sans-serif';
  ctx.textBaseline = 'top';

  const first = Math.floor(Math.min(...ends) / minor);
  const last = Math.ceil(Math.max(...ends) / minor);
  ctx.beginPath();
  for (let index = first; index <= last; index += 1) {
    const value = index * minor;
    const pos = Math.round(toScreen(value)) + 0.5;
    const major = Math.abs(value % step) < 1e-6;
    const size = major ? RULER_SIZE * 0.6 : RULER_SIZE * 0.25;
    if (axis === 'x') {
      ctx.moveTo(pos, RULER_SIZE);
      ctx.lineTo(pos, RULER_SIZE - size);
    } else {
      ctx.moveTo(RULER_SIZE, pos);
      ctx.lineTo(RULER_SIZE - size, pos);
    }
    if (major) {
      const label = String(Math.round(value));
      if (axis === 'x') {
        ctx.fillText(label, pos + 2, 2);
      } else {
        ctx.save();
        ctx.translate(2, pos - 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    }
  }
  ctx.stroke();

  ctx.strokeStyle = colors.border;
  ctx.strokeRect(
    0.5,
    0.5,
    (axis === 'x' ? length : RULER_SIZE) - 1,
    (axis === 'x' ? RULER_SIZE : length) - 1
  );
}
