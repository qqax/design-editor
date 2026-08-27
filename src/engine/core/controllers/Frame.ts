import Base from './Base';
import { Background as BackgroundObject } from '../../objects/Background';
import { Frame as FrameObject } from '../../objects/Frame';
import {
  defaultBackgroundOptions,
  defaultFrameOptions,
  LayerType,
} from '../common/constants';
import setObjectGradient from '../utils/fabric';

import type { ILayer } from '../../types';
import type {
  ControllerOptions,
  Dimension,
  GradientOptions,
} from '../common/interfaces';

class Frame extends Base {
  constructor(props: ControllerOptions) {
    super(props);
    this.initialize();
  }

  initialize() {
    const frame = new FrameObject({
      ...defaultFrameOptions,
      originX: 'left',
      originY: 'top',
      absolutePositioned: this.config.clipToFrame,
    } as any);
    const background = new BackgroundObject({
      ...defaultBackgroundOptions,
      originX: 'left',
      originY: 'top',
      shadow: this.config.shadow,
    } as any);

    // @ts-ignore
    this.canvas.add(frame, background);
    (this.canvas as any).centerObject(frame);
    (this.canvas as any).centerObject(background);
    frame.setCoords?.();
    background.setCoords?.();

    this.state.setFrame({
      height: defaultFrameOptions.width,
      width: defaultFrameOptions.height,
    });

    setTimeout(() => {
      this.editor.zoom.zoomToFit();
      this.editor.history.initialize();
    }, 50);
  }

  get frame() {
    // @ts-ignore
    return this.canvas
      .getObjects()
      .find(
        (object) => object.type === LayerType.FRAME
      ) as Required<FrameObject>;
  }

  get background() {
    // @ts-ignore
    return this.canvas
      .getObjects()
      .find(
        (object) => object.type === LayerType.BACKGROUND
      ) as Required<BackgroundObject>;
  }

  get options(): Required<ILayer> {
    const options = this.frame.toJSON(this.config.propertiesToInclude);
    return options as unknown as Required<ILayer>;
  }

  public resize({ height, width }: Dimension) {
    this.state.setFrame({
      height,
      width,
    });
    const { frame } = this;
    const { background } = this;
    // @ts-ignore
    frame.set({ width, height });
    (this.canvas as any).centerObject(frame);
    frame.setCoords?.();
    if (background) {
      // @ts-ignore
      background.set({ width, height });
      (this.canvas as any).centerObject(background);
      background.setCoords?.();
    }
    this.editor.zoom.zoomToFit();
  }

  public setHoverCursor = (cursor: string) => {
    const { background } = this;
    if (background) {
      background.set('hoverCursor', cursor);
    }
  };

  public setBackgroundColor = (color: string) => {
    let { background } = this;
    if (!background) {
      background = new BackgroundObject({
        name: 'Initial Frame',
        fill: color,
        id: 'background',
        selectable: false,
        hasControls: false,
        lockMovementY: true,
        lockMovementX: true,
        strokeWidth: 0,
        padding: 0,
        evented: false,
        width: this.frame.width,
        height: this.frame.height,
        left: this.frame.left,
        top: this.frame.top,
        originX: this.frame.originX,
        originY: this.frame.originY,
        shadow: this.config.shadow,
      } as any) as Required<BackgroundObject>;
      // @ts-ignore
      this.canvas.insertAt(1, background);
    } else {
      background.set({ fill: color });
      background.set('dirty', true);
    }
    this.canvas.requestRenderAll();
    this.editor.history.save();
  };

  public setBackgroundGradient = ({ angle, colors }: GradientOptions) => {
    let { background } = this;
    if (!background) {
      background = new BackgroundObject({
        name: 'Initial Frame',
        fill: '#ffffff',
        id: 'background',
        selectable: false,
        hasControls: false,
        lockMovementY: true,
        lockMovementX: true,
        strokeWidth: 0,
        padding: 0,
        evented: false,
        width: this.frame.width,
        height: this.frame.height,
        left: this.frame.left,
        top: this.frame.top,
        originX: this.frame.originX,
        originY: this.frame.originY,
        shadow: this.config.shadow,
      } as any) as Required<BackgroundObject>;
      // @ts-ignore
      this.canvas.insertAt(1, background);
    }
    // @ts-ignore
    setObjectGradient(background, angle, colors);
    background.set('dirty', true);
    this.canvas.requestRenderAll();
    this.editor.history.save();
  };

  public getBoundingClientRect() {
    const { frame } = this;
    return frame.getBoundingRect();
  }

  get fitRatio() {
    const options = this.frame;
    const canvasWidth = this.canvas.width - this.config.frameMargin;
    const canvasHeight = this.canvas.height - this.config.frameMargin;
    let scaleX = canvasWidth / options.width;
    const scaleY = canvasHeight / options.height;
    if (options.height >= options.width) {
      scaleX = scaleY;
      if (canvasWidth < options.width * scaleX) {
        scaleX *= canvasWidth / (options.width * scaleX);
      }
    } else if (canvasHeight < options.height * scaleX) {
      scaleX *= canvasHeight / (options.height * scaleX);
    }
    return scaleX;
  }
}
export default Frame;
