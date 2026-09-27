import { buildPdf } from './pdf';
import { canvasToBlob, deflate, flatten, splitChannels } from './raster';
import { pxToPt } from './units';

import type { Insets, PdfImage } from './pdf';
import type { IScene } from '../../types';

export type ExportFormat = 'png' | 'jpg' | 'webp' | 'pdf' | 'svg';

export const EXPORT_FORMATS: Record<
  ExportFormat,
  { mime: string; extension: string }
> = {
  png: { mime: 'image/png', extension: 'png' },
  jpg: { mime: 'image/jpeg', extension: 'jpg' },
  webp: { mime: 'image/webp', extension: 'webp' },
  pdf: { mime: 'application/pdf', extension: 'pdf' },
  svg: { mime: 'image/svg+xml', extension: 'svg' },
};

export interface ExportOptions {
  format: ExportFormat;
  /** Pixel multiplier for raster output and the image inside a PDF */
  scale?: number;
  /** 0…1, for JPEG and WebP (also a JPEG-compressed PDF) */
  quality?: number;
  /** PDF: pixels per inch of the design, which sets the physical page size */
  dpi?: number;
  /** PDF: embed the image losslessly (keeps transparency) or as JPEG */
  pdfImage?: 'lossless' | 'jpeg';
  /** PDF: trim lines inset from the page edges, in design pixels */
  trim?: Insets;
  cropMarks?: boolean;
  /** SVG: extra CSS for the file, typically font imports */
  svgCss?: string;
}

export interface SceneRenderer {
  toCanvasElement: (
    scene: IScene,
    multiplier?: number
  ) => Promise<HTMLCanvasElement>;
  toSVG: (scene: IScene, css?: string) => Promise<string>;
}

async function pdfImage(
  canvas: HTMLCanvasElement,
  mode: 'lossless' | 'jpeg',
  quality: number
): Promise<PdfImage> {
  const { width, height } = canvas;
  if (mode === 'jpeg') {
    const blob = await canvasToBlob(flatten(canvas), 'image/jpeg', quality);
    return {
      width,
      height,
      filter: 'DCTDecode',
      data: new Uint8Array(await blob.arrayBuffer()),
    };
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is not available');
  const { rgb, alpha } = splitChannels(
    ctx.getImageData(0, 0, width, height).data
  );
  return {
    width,
    height,
    filter: 'FlateDecode',
    data: await deflate(rgb),
    ...(alpha && { alpha: await deflate(alpha) }),
  };
}

export async function exportScene(
  renderer: SceneRenderer,
  scene: IScene,
  options: ExportOptions
): Promise<Blob> {
  const { format, scale = 1, quality = 0.92 } = options;
  const { mime } = EXPORT_FORMATS[format];

  if (format === 'svg') {
    return new Blob([await renderer.toSVG(scene, options.svgCss)], {
      type: mime,
    });
  }

  const canvas = await renderer.toCanvasElement(scene, scale);

  if (format === 'png') return canvasToBlob(canvas, 'image/png');
  if (format === 'jpg') {
    return canvasToBlob(flatten(canvas), 'image/jpeg', quality);
  }
  if (format === 'webp') return canvasToBlob(canvas, 'image/webp', quality);

  const dpi = options.dpi ?? 300;
  const { width, height } = scene.frame;
  const trim = options.trim ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const pdf = buildPdf(
    await pdfImage(canvas, options.pdfImage ?? 'lossless', quality),
    {
      width: pxToPt(width, dpi),
      height: pxToPt(height, dpi),
      trim: {
        top: pxToPt(trim.top, dpi),
        right: pxToPt(trim.right, dpi),
        bottom: pxToPt(trim.bottom, dpi),
        left: pxToPt(trim.left, dpi),
      },
      cropMarks: options.cropMarks,
      title: scene.name,
    }
  );
  return new Blob([pdf], { type: mime });
}
