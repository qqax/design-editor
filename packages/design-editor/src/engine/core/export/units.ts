export const MM_PER_INCH = 25.4;
export const PT_PER_INCH = 72;

export const pxToMm = (px: number, dpi: number) => (px / dpi) * MM_PER_INCH;
export const pxToPt = (px: number, dpi: number) => (px / dpi) * PT_PER_INCH;
export const mmToPx = (mm: number, dpi: number) =>
  Math.round((mm / MM_PER_INCH) * dpi);
