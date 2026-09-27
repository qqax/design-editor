export type RasterMime = 'image/png' | 'image/jpeg' | 'image/webp';

/** Copy of `source` drawn over a solid colour (JPEG has no alpha channel) */
export function flatten(
  source: HTMLCanvasElement,
  color = '#ffffff'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is not available');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: RasterMime,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error(`Failed to encode ${type}`)),
      type,
      quality
    );
  });
}

/** zlib (RFC 1950) stream, as PDF's FlateDecode expects */
export async function deflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Splits RGBA pixels; `alpha` is null when every pixel is opaque */
export function splitChannels(rgba: Uint8ClampedArray): {
  rgb: Uint8Array;
  alpha: Uint8Array | null;
} {
  const pixels = rgba.length / 4;
  const rgb = new Uint8Array(pixels * 3);
  const alpha = new Uint8Array(pixels);
  let opaque = true;
  for (let i = 0; i < pixels; i += 1) {
    rgb[i * 3] = rgba[i * 4];
    rgb[i * 3 + 1] = rgba[i * 4 + 1];
    rgb[i * 3 + 2] = rgba[i * 4 + 2];
    alpha[i] = rgba[i * 4 + 3];
    if (alpha[i] !== 255) opaque = false;
  }
  return { rgb, alpha: opaque ? null : alpha };
}
