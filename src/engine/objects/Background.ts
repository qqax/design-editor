import { classRegistry, Rect, Shadow } from 'fabric';

import type { ObjectEvents, RectProps, SerializedRectProps } from 'fabric';

const defaultShadow = {
  blur: 10,
  color: '#C7C7C7',
  offsetX: 0,
  offsetY: 0,
};

export interface BackgroundOptions extends RectProps {
  id: string;
  name: string;
  description?: string;
}

export class Background extends Rect {
  static type = 'Background';

  get type() {
    return 'Background';
  }

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(options: BackgroundOptions) {
    const shadowOptions = options.shadow ? options.shadow : defaultShadow;
    const shadow = new Shadow({
      affectStroke: false,
      ...(shadowOptions as any),
    });

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
      shadow,
    });

    this.on('mouseup', ({ target }) => {
      // @ts-ignore — vendored: canvas is non-null at runtime when object is on canvas
      const activeSelection = this.canvas?.getActiveObject();
      if (!activeSelection && target === this) {
        // @ts-ignore — vendored
        this.canvas?.fire('background:selected');
      }
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

  static async fromObject(options: BackgroundOptions) {
    return new Background(options);
  }
}

classRegistry.setClass(Background, Background.type);

declare module 'fabric' {
  export interface Background {}
}
