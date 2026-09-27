import { Canvas, classRegistry, Rect } from 'fabric';

import type { RectProps } from 'fabric';

export interface BackgroundOptions extends Partial<RectProps> {
  id: string;
  name: string;
  description?: string;
}

declare module 'fabric' {
  interface CanvasEvents {
    'background:selected': Record<string, never>;
  }
}

export class Background extends Rect {
  static type = 'Background';

  // eslint-disable-next-line class-methods-use-this -- fabric reads the type per instance
  get type() {
    return 'Background';
  }

  // eslint-disable-next-line class-methods-use-this -- written by fabric while deserializing
  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(options: BackgroundOptions) {
    super({
      ...options,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      lockMovementY: true,
      lockMovementX: true,
      strokeWidth: 0,
      evented: true,
      hoverCursor: 'default',
      // The page shadow lives on the Frame; here it would tint translucent fills.
      shadow: null,
    });

    this.on('mouseup', ({ target }) => {
      const { canvas } = this;
      if (
        canvas instanceof Canvas &&
        !canvas.getActiveObject() &&
        target === this
      ) {
        canvas.fire('background:selected', {});
      }
    });
  }
}

classRegistry.setClass(Background, Background.type);
