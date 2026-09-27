import { EXPORT_FORMATS, pxToMm } from '../../../engine';

import type { ExportFormat, ExportOptions, PageOffsets } from '../../../engine';

export type ExportTarget = 'download' | 'library';

export interface ExportSettings {
  format: ExportFormat;
  /** Pixel multiplier */
  scale: number;
  /** 0.1…1 */
  quality: number;
  /** PDF page resolution */
  dpi: number;
  pdfImage: 'lossless' | 'jpeg';
  /** PDF: page offsets become the trim box, the rest is bleed */
  trimAtOffsets: boolean;
  cropMarks: boolean;
}

export const EXPORT_SCALES = [1, 2, 3, 4] as const;
export const EXPORT_DPIS = [72, 150, 300] as const;

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'png',
  scale: 1,
  quality: 0.92,
  dpi: 300,
  pdfImage: 'lossless',
  trimAtOffsets: true,
  cropMarks: false,
};

const pick = <T>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

/** Repairs settings read back from storage */
export function sanitizeExportSettings(raw: unknown): ExportSettings {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Partial<
    Record<keyof ExportSettings, unknown>
  >;
  const d = DEFAULT_EXPORT_SETTINGS;
  const quality = Number(value.quality);
  return {
    format: pick(
      value.format,
      Object.keys(EXPORT_FORMATS) as ExportFormat[],
      d.format
    ),
    scale: pick(value.scale, EXPORT_SCALES, d.scale),
    quality:
      Number.isFinite(quality) && quality >= 0.1 && quality <= 1
        ? quality
        : d.quality,
    dpi: pick(value.dpi, EXPORT_DPIS, d.dpi),
    pdfImage: pick(value.pdfImage, ['lossless', 'jpeg'] as const, d.pdfImage),
    trimAtOffsets:
      typeof value.trimAtOffsets === 'boolean'
        ? value.trimAtOffsets
        : d.trimAtOffsets,
    cropMarks:
      typeof value.cropMarks === 'boolean' ? value.cropMarks : d.cropMarks,
  };
}

export const hasOffsets = (offsets: PageOffsets) =>
  offsets.top > 0 ||
  offsets.right > 0 ||
  offsets.bottom > 0 ||
  offsets.left > 0;

export function toExportOptions(
  settings: ExportSettings,
  offsets: PageOffsets
): ExportOptions {
  const { format, scale, quality, dpi, pdfImage, cropMarks } = settings;
  if (format === 'svg') return { format };
  if (format !== 'pdf') return { format, scale, quality };
  return {
    format,
    scale,
    quality,
    dpi,
    pdfImage,
    cropMarks,
    ...(settings.trimAtOffsets && hasOffsets(offsets) && { trim: offsets }),
  };
}

const round = (value: number, digits = 1) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export interface OutputSummary {
  pixels: string;
  /** Physical page size for PDF */
  page?: string;
  trim?: string;
}

export function describeOutput(
  settings: ExportSettings,
  frame: { width: number; height: number },
  offsets: PageOffsets
): OutputSummary {
  const { width, height } = frame;
  if (settings.format === 'svg') return { pixels: `${width} × ${height} px` };

  const pixels = `${Math.round(width * settings.scale)} × ${Math.round(
    height * settings.scale
  )} px`;
  if (settings.format !== 'pdf') return { pixels };

  const { dpi } = settings;
  const mm = (px: number) => round(pxToMm(px, dpi));
  const trimmed =
    settings.trimAtOffsets && hasOffsets(offsets)
      ? `${mm(width - offsets.left - offsets.right)} × ${mm(
          height - offsets.top - offsets.bottom
        )} mm`
      : undefined;
  return {
    pixels,
    page: `${mm(width)} × ${mm(height)} mm at ${dpi} dpi`,
    ...(trimmed && { trim: trimmed }),
  };
}

export function exportFileName(
  name: string | undefined,
  format: ExportFormat,
  now = new Date()
): string {
  const base =
    (name ?? '')
      .trim()
      .replace(/[\\/:*?"<>|]+/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80) ||
    `design-${now.toISOString().slice(0, 19).replace(/[T:]/g, '-')}`;
  return `${base}.${EXPORT_FORMATS[format].extension}`;
}
