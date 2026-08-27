import { classRegistry, FabricImage as FabricImageClass, util } from 'fabric';

import type { ImageProps } from 'fabric';

export interface StaticImageOptions extends ImageProps {
  id: string;
  name?: string;
  description?: string;
  subtype: string;
  src: string;
}

export class StaticImage extends FabricImageClass {
  static type = 'StaticImage';

  get type() {
    return 'StaticImage';
  }

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  public role = 'regular';

  constructor(element: HTMLImageElement, options: any) {
    super(element, options);
    if (options.role) {
      this.role = options.role;
    }
  }

  static async fromObject(options: any): Promise<StaticImage> {
    return new Promise((resolve, reject) => {
      util
        .loadImage(options.src, { crossOrigin: 'anonymous' })
        .then((img) => {
          resolve(new StaticImage(img, options));
        })
        .catch(reject);
    });
  }

  // @ts-ignore
  toObject(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as any);
  }

  // @ts-ignore
  toJSON(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as any);
  }
}

classRegistry.setClass(StaticImage, StaticImage.type);

declare module 'fabric' {
  export interface StaticImage {}
}
