import { Canvas as FabricCanvasClass } from 'fabric';

import type { Editor } from '.';
import type { EditorConfig } from '../types';
import type { FabricCanvas } from './common/interfaces';

class Canvas {
  private editor: Editor;

  public container: HTMLDivElement;
  public canvasContainer: HTMLDivElement;
  public canvasElement: HTMLCanvasElement;

  public canvas: FabricCanvas;

  public canvasId: string;

  private options = {
    width: 0,
    height: 0,
  };

  private config: EditorConfig;

  constructor({
                id,
                config,
                editor,
              }: {
    id: string;
    config: EditorConfig;
    editor: Editor;
  }) {
    this.config = config;
    this.editor = editor;
    this.canvasId = id;

    this.initialize();
  }

  public initialize = () => {
    this.canvas = new FabricCanvasClass(
      this.canvasId,
      {
        backgroundColor: this.config.background,
        preserveObjectStacking: true,
        fireRightClick: true,
        height: this.config.size.height,
        width: this.config.size.width,
      },
    );

    this.options.width = this.config.size.width;
    this.options.height = this.config.size.height;

    /*
     * Fabric 6 doesn't expose the old event
     * enable/disable API used by the original
     * editor implementation.
     */
    this.canvas.disableEvents = () => {
      // no-op
    };

    this.canvas.enableEvents = () => {
      // no-op
    };
  };

  private debugLayout = (label: string) => {
    const canvas = this.canvas;

    if (!canvas) {
      console.log(`[EDITOR DEBUG] ${label}: no canvas`);
      return;
    }

    const frame = this.editor.frame?.frame;
    const vpt = canvas.viewportTransform;

    console.group(`[EDITOR DEBUG] ${label}`);

    console.log('CANVAS', {
      width: canvas.width,
      height: canvas.height,
      clientWidth: canvas.getElement()?.clientWidth,
      clientHeight: canvas.getElement()?.clientHeight,
    });

    console.log('OPTIONS', {
      width: this.options.width,
      height: this.options.height,
    });

    console.log('VPT', vpt);

    if (frame) {
      const center = frame.getCenterPoint();

      console.log('FRAME', {
        left: frame.left,
        top: frame.top,
        width: frame.width,
        height: frame.height,
        scaleX: frame.scaleX,
        scaleY: frame.scaleY,
        originX: frame.originX,
        originY: frame.originY,
        center,
      });

      if (vpt) {
        console.log('FRAME SCREEN', {
          left:
            frame.left! * vpt[0] + vpt[4],
          top:
            frame.top! * vpt[3] + vpt[5],
          centerX:
            center.x * vpt[0] +
            center.y * vpt[2] +
            vpt[4],
          centerY:
            center.x * vpt[1] +
            center.y * vpt[3] +
            vpt[5],
        });
      }
    }

    console.log(
      'OBJECTS',
      canvas.getObjects().map((object) => ({
        type: object.type,
        id: object.id,
        left: object.left,
        top: object.top,
        width: object.width,
        height: object.height,
        scaleX: object.scaleX,
        scaleY: object.scaleY,
        center: object.getCenterPoint(),
      })),
    );

    const element = canvas.getElement();

    if (element) {
      console.log(
        'DOM RECT',
        element.getBoundingClientRect(),
      );
    }

    console.groupEnd();
  };

  public destroy = () => {
    // this.canvas.dispose();
  };

  public resize = ({
                     width,
                     height,
                   }: {
    width: number;
    height: number;
  }) => {
    const oldWidth = this.options.width;
    const oldHeight = this.options.height;

    if (
      oldWidth === width &&
      oldHeight === height
    ) {
      return;
    }

    const vpt = this.canvas.viewportTransform;

    console.log('[EDITOR DEBUG] RESIZE', {
      oldWidth,
      oldHeight,
      width,
      height,
      vpt: vpt ? [...vpt] : null,
    });

    const frame = this.editor.frame?.frame;

    console.log('[EDITOR DEBUG] FRAME BEFORE RESIZE', {
      left: frame?.left,
      top: frame?.top,
      width: frame?.width,
      height: frame?.height,
      scaleX: frame?.scaleX,
      scaleY: frame?.scaleY,
    });

    this.canvas.setDimensions({
      width,
      height,
    });

    if (vpt) {
      const dx = (width - oldWidth) / 2;
      const dy = (height - oldHeight) / 2;

      const nextVpt: [
        number,
        number,
        number,
        number,
        number,
        number,
      ] = [
        vpt[0],
        vpt[1],
        vpt[2],
        vpt[3],
        vpt[4] + dx,
        vpt[5] + dy,
      ];

      this.canvas.setViewportTransform(nextVpt);
    }

    this.options.width = width;
    this.options.height = height;

    this.canvas.requestRenderAll();

    console.log('[EDITOR DEBUG] FRAME AFTER RESIZE', {
      left: frame?.left,
      top: frame?.top,
      width: frame?.width,
      height: frame?.height,
    });

    console.log(
      '[EDITOR DEBUG] VPT AFTER RESIZE',
      this.canvas.viewportTransform
        ? [...this.canvas.viewportTransform]
        : null,
    );

    this.editor.emit('canvas:resized');
  };

  public getBoundingClientRect() {
    const canvasEl = document.getElementById(
      this.canvasId,
    );

    if (!canvasEl) {
      return {
        left: 0,
        top: 0,
      };
    }

    const rect =
      canvasEl.getBoundingClientRect();

    return {
      left: rect.left,
      top: rect.top,
    };
  }

  public requestRenderAll() {
    this.canvas.requestRenderAll();
  }

  public get backgroundColor() {
    return this.canvas.backgroundColor;
  }

  public setBackgroundColor(
    color: string,
  ) {
    this.canvas.backgroundColor = color;
    this.canvas.requestRenderAll();

    this.editor.emit('canvas:updated');
  }
}

declare module 'fabric' {
  export interface Canvas {
    __fire: any;
    enableEvents: () => void;
    disableEvents: () => void;
  }

  export interface Object {
    id: string;
    name: string;
    locked: boolean;

    duration?: {
      start?: number;
      stop?: number;
    };

    metadata?: Record<string, any>;
  }
}

export default Canvas;