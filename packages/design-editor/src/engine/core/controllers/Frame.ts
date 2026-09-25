import Base from './Base';
import { Background as BackgroundObject } from '../../objects/Background';
import { Frame as FrameObject } from '../../objects/Frame';
import { LayerType } from '../../types';
import {
  defaultBackgroundOptions,
  defaultFrameOptions,
} from '../common/constants';
import setObjectGradient from '../utils/fabric';

import type { FabricObject } from 'fabric';

import type { ILayer } from '../../types';
import type {
  ControllerOptions,
  Dimension,
  GradientOptions,
} from '../common/interfaces';

class Frame extends Base {
  // Simple event emitter map
  private listeners = new Map<string, Set<() => void>>();

  constructor(props: ControllerOptions) {
    super(props);
    this.initialize();
  }

  public on(event: string, callback: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  public off(event: string, callback: () => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string) {
    this.listeners.get(event)?.forEach((cb) => cb());
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

    this.canvas.add(frame, background);

    this.canvas.centerObject(frame);
    this.canvas.centerObject(background);

    frame.setCoords();
    background.setCoords();

    this.state.setFrame({
      height: defaultFrameOptions.width,
      width: defaultFrameOptions.height,
    });

    setTimeout(() => {
      this.editor.zoom.zoomToFit();
      this.editor.history.initialize();
    }, 50);
  }

  get frame(): FabricObject {
    const frame = this.canvas
      .getObjects()
      .find((object) => object.type === LayerType.FRAME);

    if (!frame) {
      throw new Error('Frame object not found');
    }

    return frame;
  }

  get background(): FabricObject | undefined {
    return this.canvas
      .getObjects()
      .find((object) => object.type === LayerType.BACKGROUND);
  }

  get options(): Required<ILayer> {
    return this.frame.toObject(this.config.propertiesToInclude);
  }

  public resize({ height, width }: Dimension) {
    const { frame, background } = this;

    this.state.setFrame({
      height,
      width,
    });

    frame.set({
      width,
      height,
    });

    (this.canvas as any).centerObject(frame);
    frame.setCoords();

    if (background) {
      background.set({
        width,
        height,
      });

      (this.canvas as any).centerObject(background);
      background.setCoords();
    }

    // Trigger the modified event
    this.emit('modified');
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
      });

      this.canvas.insertAt(1, background);
    } else {
      background.set({
        fill: color,
      });

      background.set('dirty', true);
    }

    this.canvas.requestRenderAll();
    this.editor.history.save();
    this.emit('modified');
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
      });

      this.canvas.insertAt(1, background);
    }

    setObjectGradient(background, angle, colors);

    background.set('dirty', true);

    this.canvas.requestRenderAll();
    this.editor.history.save();
    this.emit('modified');
  };

  public getBoundingClientRect() {
    return this.frame.getBoundingRect();
  }

  get fitRatio() {
    const { frame } = this;

    const canvasWidth = this.canvas.width - this.config.frameMargin;

    const canvasHeight = this.canvas.height - this.config.frameMargin;

    let scaleX = canvasWidth / (frame.width ?? 1);

    const scaleY = canvasHeight / (frame.height ?? 1);

    if ((frame.height ?? 0) >= (frame.width ?? 0)) {
      scaleX = scaleY;

      if (canvasWidth < (frame.width ?? 0) * scaleX) {
        scaleX *= canvasWidth / ((frame.width ?? 0) * scaleX);
      }
    } else if (canvasHeight < (frame.height ?? 0) * scaleX) {
      scaleX *= canvasHeight / ((frame.height ?? 0) * scaleX);
    }

    return scaleX;
  }
}

export default Frame;
