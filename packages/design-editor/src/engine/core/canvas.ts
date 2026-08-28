import {Canvas as FabricCanvasClass, Point} from 'fabric';

import type {Editor} from '.';
import type {EditorConfig} from '../types';
import type {FabricCanvas} from './common/interfaces';

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
    // In Fabric 6, you must pass the canvas element or id
    this.canvas = new FabricCanvasClass(this.canvasId, {
      backgroundColor: this.config.background,
      preserveObjectStacking: true,
      fireRightClick: true,
      height: this.config.size.height,
      width: this.config.size.width,
    });

    this.canvas.disableEvents = function () {
      // no-op in v6
    };

    this.canvas.enableEvents = function () {
      // no-op in v6
    };
  };

  public destroy = () => {
    // this.canvas.dispose()
  };

  public resize({ width, height }: any) {
    this.canvas.setDimensions({ width, height });
    this.canvas.renderAll();
    const diffWidth = width / 2 - this.options.width / 2;
    const diffHeight = height / 2 - this.options.height / 2;

    this.options.width = width;
    this.options.height = height;

    const deltaPoint = new Point(diffWidth, diffHeight);
    this.canvas.relativePan(deltaPoint);
  }

  public getBoundingClientRect() {
    const canvasEl = document.getElementById('canvas');
    return {
      left: canvasEl?.getBoundingClientRect().left,
      top: canvasEl?.getBoundingClientRect().top,
    };
  }

  public requestRenderAll() {
    this.canvas.requestRenderAll();
  }

  public get backgroundColor() {
    return this.canvas.backgroundColor;
  }

  public setBackgroundColor(color: string) {
    // In Fabric 6, setBackgroundColor takes the color and renders
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
