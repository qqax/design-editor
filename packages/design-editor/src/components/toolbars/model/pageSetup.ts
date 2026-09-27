import { fromPx, toPx } from '../../../engine';

import type { LengthUnit, PageOffsets } from '../../../engine';

export const MIN_PAGE_PX = 50;
export const MAX_PAGE_PX = 10000;
export const DEFAULT_DPI = 300;

export interface PageSetupInput {
  unit: LengthUnit;
  /** Trim size in `unit` */
  width: number;
  height: number;
  /** Bleed on every edge, in `unit` */
  bleed: number;
  dpi: number;
}

export interface PageSetup {
  /** Frame size in pixels, bleed included */
  width: number;
  height: number;
  /** Bleed as page offsets, in pixels */
  offsets: PageOffsets;
  dpi: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const sanitizeDpi = (dpi: number) =>
  Number.isFinite(dpi) && dpi >= 1
    ? Math.round(clamp(dpi, 1, 2400))
    : DEFAULT_DPI;

/** Frame and offsets for a trim size plus bleed given in any unit */
export function pageSetupToPixels(input: PageSetupInput): PageSetup {
  const dpi = sanitizeDpi(input.dpi);
  const px = (value: number) =>
    Math.round(toPx(Number.isFinite(value) ? value : 0, input.unit, dpi));
  const bleed = Math.max(0, px(input.bleed));
  const width = clamp(px(input.width), MIN_PAGE_PX, MAX_PAGE_PX - bleed * 2);
  const height = clamp(px(input.height), MIN_PAGE_PX, MAX_PAGE_PX - bleed * 2);
  return {
    width: width + bleed * 2,
    height: height + bleed * 2,
    offsets: { top: bleed, right: bleed, bottom: bleed, left: bleed },
    dpi,
  };
}

/** The inverse: fields to show for the current frame, reading equal offsets as bleed */
export function pageSetupFromPixels(
  frame: { width: number; height: number },
  offsets: PageOffsets,
  unit: LengthUnit,
  dpi: number
): Omit<PageSetupInput, 'unit' | 'dpi'> {
  const { top, right, bottom, left } = offsets;
  const bleed = top === right && right === bottom && bottom === left ? top : 0;
  const round = (value: number) =>
    unit === 'px' ? Math.round(value) : Math.round(value * 100) / 100;
  const inUnit = (px: number) => round(fromPx(px, unit, sanitizeDpi(dpi)));
  return {
    width: inUnit(frame.width - bleed * 2),
    height: inUnit(frame.height - bleed * 2),
    bleed: inUnit(bleed),
  };
}
