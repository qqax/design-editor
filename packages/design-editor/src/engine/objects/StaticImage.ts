import { classRegistry, FabricImage as FabricImageClass, util } from 'fabric';

import type { ImageProps } from 'fabric';

export interface StaticImageOptions extends ImageProps {
  id: string;
  name?: string;
  description?: string;
  subtype: string;
  src: string;
  /** Rounded corners, in page pixels */
  cornerRadius?: number;
}

/** Rounded rectangle path; corners are elliptical so they stay round under non-uniform scaling */
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rx: number,
  ry: number
) {
  const x = -width / 2;
  const y = -height / 2;
  const k = 0.4477; // 1 - 0.5523 (bezier circle constant)
  ctx.beginPath();
  ctx.moveTo(x + rx, y);
  ctx.lineTo(x + width - rx, y);
  ctx.bezierCurveTo(
    x + width - k * rx,
    y,
    x + width,
    y + k * ry,
    x + width,
    y + ry
  );
  ctx.lineTo(x + width, y + height - ry);
  ctx.bezierCurveTo(
    x + width,
    y + height - k * ry,
    x + width - k * rx,
    y + height,
    x + width - rx,
    y + height
  );
  ctx.lineTo(x + rx, y + height);
  ctx.bezierCurveTo(
    x + k * rx,
    y + height,
    x,
    y + height - k * ry,
    x,
    y + height - ry
  );
  ctx.lineTo(x, y + ry);
  ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);
  ctx.closePath();
}

export class StaticImage extends FabricImageClass {
  static type = 'StaticImage';

  static cacheProperties = [
    ...FabricImageClass.cacheProperties,
    'cornerRadius',
  ];

  // eslint-disable-next-line class-methods-use-this -- fabric reads the type per instance
  get type() {
    return 'StaticImage';
  }

  // eslint-disable-next-line class-methods-use-this -- written by fabric while deserializing
  set type(_value: string) {
    // fixed value — intentional no-op
  }

  public role = 'regular';

  declare cornerRadius: number;

  constructor(element: HTMLImageElement, options: any) {
    super(element, options);
    this.cornerRadius = Number(options?.cornerRadius) || 0;
    if (options.role) {
      this.role = options.role;
    }
  }

  _render(ctx: CanvasRenderingContext2D) {
    const radius = this.cornerRadius;
    if (!(radius > 0)) {
      super._render(ctx);
      return;
    }
    const { width, height } = this;
    const rx = Math.min(radius / Math.abs(this.scaleX || 1), width / 2);
    const ry = Math.min(radius / Math.abs(this.scaleY || 1), height / 2);
    ctx.save();
    roundedRectPath(ctx, width, height, rx, ry);
    ctx.clip();
    super._render(ctx);
    ctx.restore();
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

  // @ts-expect-error -- narrower than fabric's generic toObject
  toObject(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as never);
  }

  toJSON(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as never);
  }
}

classRegistry.setClass(StaticImage, StaticImage.type);
