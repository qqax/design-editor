import type {ImageProps} from 'fabric';
import {classRegistry, FabricImage as FabricImageClass, util} from 'fabric';

export interface BackgroundImageOptions extends ImageProps {
  id: string;
  name?: string;
  description?: string;
  subtype: string;
  src: string;
}

export class BackgroundImage extends FabricImageClass {
  static type = 'BackgroundImage';

  get type() {
    return 'BackgroundImage';
  }

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(element: HTMLImageElement, options: any) {
    super(element, {
      ...options,
      hasControls: false,
      lockMovementY: true,
      lockMovementX: true,
      selectable: false,
      hoverCursor: 'default',
      hasBorders: false,
    });

    this.on('mouseup', ({ target }) => {
      // @ts-ignore
      const activeSelection = this.canvas?.getActiveObject();
      if (!activeSelection && target === this) {
        // @ts-ignore
        this.canvas?.fire('background:selected');
      }
    });

    this.on('mousedblclick', () => {
      this.set({
        hasControls: true,
        lockMovementY: false,
        lockMovementX: false,
        hasBorders: true,
      });
      // @ts-ignore
      this.canvas?.setActiveObject(this);
      this.canvas?.requestRenderAll();
    });
  }

  static async fromObject(options: any): Promise<BackgroundImage> {
    return new Promise((resolve, reject) => {
      util
        .loadImage(options.src, { crossOrigin: 'anonymous' })
        .then((img) => {
          resolve(new BackgroundImage(img, options));
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

classRegistry.setClass(BackgroundImage, BackgroundImage.type);

declare module 'fabric' {
  export interface BackgroundImage {}
}
