import { classRegistry, FabricImage as FabricImageClass, util } from 'fabric';

export class StaticVideo extends FabricImageClass {
  static type = 'StaticVideo';

  get type() {
    return 'StaticVideo';
  }

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(video: HTMLVideoElement, options: any) {
    const defaultOpts = {
      objectCaching: false,
      cacheProperties: ['time'],
    };
    super(video, { ...defaultOpts, ...(options || {}) });
  }

  _draw(video: any, ctx: any, w: any, h: any) {
    const d = {
      x: -this.width / 2,
      y: -this.height / 2,
      w: this.width,
      h: this.height,
    };
    ctx.drawImage(video, d.x, d.y, d.w, d.h);
  }

  _render(ctx: CanvasRenderingContext2D) {
    this._draw(this.getElement(), ctx, this.width, this.height);
  }

  // @ts-ignore
  toObject(propertiesToInclude: string[] = []): any {
    return {
      ...super.toObject(propertiesToInclude as any),
    };
  }

  // @ts-ignore
  toJSON(propertiesToInclude: string[] = []): any {
    return {
      ...super.toObject(propertiesToInclude as any),
    };
  }
}

classRegistry.setClass(StaticVideo, StaticVideo.type);

declare module 'fabric' {
  export interface StaticVideo {}
}
