import { util } from 'fabric';

export async function loadFabricImageFromURL(src: string) {
  return new Promise(async (resolve) => {
    const img = await util.loadImage(src);
    resolve(img);
  });
}

export async function loadImageFromURL(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (err) => {
      console.error('[loadImageFromURL] Error loading image:', src, err);
      reject(new Error(`Failed to load image: ${src}`));
    };
  });
}
