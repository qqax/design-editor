export interface ImageGeometry {
  width: number;
  height: number;
  cropX: number;
  cropY: number;
  scaleX: number;
  scaleY: number;
}

interface Size {
  width: number;
  height: number;
}

/** Keeps the displayed size and crop when an image's source is replaced by one of another resolution. */
export function rescaleImageGeometry(
  geometry: ImageGeometry,
  originalSize: Size,
  nextSize: Size
): ImageGeometry {
  const rx = nextSize.width / originalSize.width;
  const ry = nextSize.height / originalSize.height;
  return {
    width: geometry.width * rx,
    height: geometry.height * ry,
    cropX: geometry.cropX * rx,
    cropY: geometry.cropY * ry,
    scaleX: geometry.scaleX / rx,
    scaleY: geometry.scaleY / ry,
  };
}
