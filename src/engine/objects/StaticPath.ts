import { classRegistry, Path } from 'fabric';

import type { PathProps } from 'fabric';

export type StaticPathOptions = PathProps & { path: string };

export class StaticPath extends Path {
  static type = 'StaticPath';

  get type() {
    return 'StaticPath';
  }

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(options: StaticPathOptions) {
    const { path, ...pathOptions } = options;
    super(path, pathOptions);
  }

  // @ts-ignore
  toObject(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as any);
  }

  // @ts-ignore
  toJSON(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude as any);
  }

  static async fromObject(options: StaticPathOptions) {
    return new StaticPath(options);
  }
}

classRegistry.setClass(StaticPath, StaticPath.type);

declare module 'fabric' {
  export interface StaticPath {}
}
