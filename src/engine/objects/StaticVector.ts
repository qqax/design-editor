import { classRegistry, Group, loadSVGFromURL } from 'fabric';
import groupBy from 'lodash/groupBy';

export class StaticVector extends Group {
  static type = 'StaticVector';

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  public src: string;

  public objectColors: Record<string, any[]> = {};

  public colorMap: Record<string, string> = {};

  constructor(objects: any[], options: any, others: any) {
    const existingColorMap = others.colorMap;
    const objectColors = groupBy(objects, 'fill');

    // set colorMap
    if (existingColorMap) {
      Object.keys(existingColorMap).forEach((color) => {
        const colorObjects = objectColors[color];
        if (colorObjects) {
          colorObjects.forEach((c: any) => {
            c.fill = existingColorMap[color];
          });
        }
      });
    }

    const colorMap: Record<string, string> = {};

    Object.keys(objectColors).forEach((c) => {
      colorMap[c] = c;
    });
    if (existingColorMap) {
      Object.keys(existingColorMap).forEach((c) => {
        colorMap[c] = existingColorMap[c];
      });
    }

    // Fabric 6 groups don't have util.groupSVGElements in the same way,
    // usually loadSVGFromURL returns { objects, options }.
    // We just pass objects to Group directly.
    super(objects, { ...options, ...others, colorMap });

    this.objectColors = objectColors;
    this.colorMap = colorMap;
    this.src = others.src;
  }

  public updateLayerColor(prev: string, next: string) {
    const sameObjects = this.objectColors[prev];

    if (sameObjects) {
      sameObjects.forEach((c) => {
        c.fill = next;
      });
      this.canvas?.requestRenderAll();
      this.colorMap[prev] = next;
    }
  }

  // @ts-ignore
  toObject(propertiesToInclude: string[] = []): any {
    return {
      ...super.toObject(propertiesToInclude as any),
      src: this.src,
    };
  }

  // @ts-ignore
  toJSON(propertiesToInclude: string[] = []): any {
    return {
      ...super.toObject(propertiesToInclude as any),
      src: this.src,
    };
  }

  static async fromObject(options: any): Promise<StaticVector> {
    return new Promise((resolve, reject) => {
      loadSVGFromURL(options.src)
        .then(({ objects, options: svgOptions }) => {
          resolve(new StaticVector(objects as any, svgOptions, options));
        })
        .catch(reject);
    });
  }
}

classRegistry.setClass(StaticVector, StaticVector.type);

export type SvgOptions = Group & { text: string };

declare module 'fabric' {
  export interface StaticVector {}
}

export default StaticVector;
