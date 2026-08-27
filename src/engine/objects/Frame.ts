import { classRegistry, Rect } from 'fabric';

import type { RectProps } from 'fabric';

export interface FrameOptions extends RectProps {
  id: string;
  name: string;
  description?: string;
}

export class Frame extends Rect {
  static type = 'Frame';

  get type() {
    return 'Frame';
  }

  // No-op setter — required so Fabric's _setOptions can write `type` during
  // deserialization (loadFromJSON / enlivenObjects) without crashing.
  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(options: FrameOptions) {
    super({
      ...options,
      selectable: false,
      hasControls: false,
      lockMovementY: true,
      lockMovementX: true,
      strokeWidth: 0,
      padding: 0,
      evented: false,
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

  static async fromObject(options: FrameOptions) {
    return new Frame(options);
  }
}

classRegistry.setClass(Frame, Frame.type);

declare module 'fabric' {
  export interface Frame {}
}
