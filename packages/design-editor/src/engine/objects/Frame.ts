import { classRegistry, Rect } from 'fabric';

import type { RectProps } from 'fabric';

export interface FrameOptions extends RectProps {
  id: string;
  name: string;
  description?: string;
}

export class Frame extends Rect {
  static type = 'Frame';

  // eslint-disable-next-line class-methods-use-this -- fabric reads the type per instance
  get type() {
    return 'Frame';
  }

  // No-op setter — required so Fabric's _setOptions can write `type` during
  // deserialization (loadFromJSON / enlivenObjects) without crashing.
  // eslint-disable-next-line class-methods-use-this -- written by fabric while deserializing
  set type(_value: string) {
    // fixed value
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
      // It doubles as every layer's clipPath, which leaves its own cache blank.
      objectCaching: false,
    });
  }
}

classRegistry.setClass(Frame, Frame.type);

declare module 'fabric' {
  export type Frame = object;
}
