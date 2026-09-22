import { classRegistry, Path } from 'fabric';

import type { PathProps, TComplexPathData } from 'fabric';

export type StaticPathOptions = Partial<Omit<PathProps, 'path'>> & {
  path: TComplexPathData | string;
};

export class StaticPath extends Path {
  static type = 'StaticPath';

  // eslint-disable-next-line class-methods-use-this -- type is a fixed constant for this class
  get type() {
    return 'StaticPath';
  }

  // eslint-disable-next-line class-methods-use-this -- setter intentionally ignores value; type is immutable
  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(options: StaticPathOptions) {
    const { path, ...pathOptions } = options;
    super(path, pathOptions);
  }

  // @ts-expect-error — fabric's generic toObject signature can't be narrowed to string[]
  toObject(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as any);
  }

  toJSON(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as any);
  }

  static async fromObject(options: StaticPathOptions) {
    return new StaticPath(options);
  }
}

classRegistry.setClass(StaticPath, StaticPath.type);

declare module 'fabric' {
  export type StaticPath = object;
}
