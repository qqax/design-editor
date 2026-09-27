export const MM_PER_INCH = 25.4;
export const PT_PER_INCH = 72;

export const pxToMm = (px: number, dpi: number) => (px / dpi) * MM_PER_INCH;
export const pxToPt = (px: number, dpi: number) => (px / dpi) * PT_PER_INCH;
export const mmToPx = (mm: number, dpi: number) =>
  Math.round((mm / MM_PER_INCH) * dpi);

export type LengthUnit = 'px' | 'mm' | 'in';

/** Converts a length in `unit` to pixels at `dpi` */
export function toPx(value: number, unit: LengthUnit, dpi: number): number {
  if (unit === 'mm') return (value / MM_PER_INCH) * dpi;
  if (unit === 'in') return value * dpi;
  return value;
}

/** Converts pixels at `dpi` to a length in `unit` */
export function fromPx(px: number, unit: LengthUnit, dpi: number): number {
  if (unit === 'mm') return pxToMm(px, dpi);
  if (unit === 'in') return px / dpi;
  return px;
}
