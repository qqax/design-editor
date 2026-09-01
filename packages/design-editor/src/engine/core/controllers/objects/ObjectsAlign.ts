import { ActiveSelection } from 'fabric';
import type { Object as FabricObject } from 'fabric';

import {
  Direction,
  ScaleType,
  Size,
} from '../../common/interfaces';

import { LayerType } from '../../../types';

interface ObjectsAlignContext {
  readonly canvas: any;
  readonly editor: any;
  readonly state: any;

  getRefObject(
    id?: string,
  ): FabricObject | null;
}

export class ObjectsAlign {
  private readonly canvas: ObjectsAlignContext['canvas'];
  private readonly editor: ObjectsAlignContext['editor'];
  private readonly state: ObjectsAlignContext['state'];

  constructor(
    context: ObjectsAlignContext,
  ) {
    /*
     * Do not keep the whole Objects instance here.
     *
     * Base.canvas is protected, therefore passing `this`
     * to an interface requiring a public canvas causes:
     *
     * "Property canvas is protected..."
     */
    this.canvas = context.canvas;
    this.editor = context.editor;
    this.state = context.state;

    this.getRefObject = context.getRefObject.bind(
      context,
    );
  }

  private readonly getRefObject: (
    id?: string,
  ) => FabricObject | null;

  private get frame() {
    return this.editor.frame.frame;
  }

  public position(
    position: Direction,
    value: number,
    id?: string,
  ) {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    object.set(position, value);
    object.setCoords();

    this.canvas.requestRenderAll();

    this.editor.history.save();
  }

  public resize(
    size: Size,
    value: number,
    id?: string,
  ) {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    if (size === 'width') {
      if (!object.width) {
        return;
      }

      object.set(
        'scaleX',
        value / object.width,
      );
    }

    if (size === 'height') {
      if (!object.height) {
        return;
      }

      object.set(
        'scaleY',
        value / object.height,
      );
    }

    object.setCoords();

    this.canvas.requestRenderAll();

    this.editor.history.save();
  }

  public scale(
    type: ScaleType,
    id?: string,
  ) {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    const frame = this.frame;

    const frameWidth = frame.width ?? 0;
    const frameHeight = frame.height ?? 0;

    if (
      !object.width ||
      !object.height ||
      !frameWidth ||
      !frameHeight
    ) {
      return;
    }

    const scaleX = frameWidth / object.width;
    const scaleY = frameHeight / object.height;

    const scale =
      type === 'fill'
        ? Math.max(scaleX, scaleY)
        : Math.min(scaleX, scaleY);

    const scaledWidth = object.width * scale;
    const scaledHeight = object.height * scale;

    object.set({
      scaleX: scale,
      scaleY: scale,

      left:
        (frame.left ?? 0) +
        frameWidth / 2 -
        scaledWidth / 2,

      top:
        (frame.top ?? 0) +
        frameHeight / 2 -
        scaledHeight / 2,
    });

    object.setCoords();

    this.canvas.requestRenderAll();

    this.editor.history.save();
  }

  public alignTop = (id?: string) => {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    if (
      object.type === LayerType.ACTIVE_SELECTION
    ) {
      this.alignSelection(
        object as ActiveSelection,
        'top',
        object.top ?? 0,
      );
    } else {
      object.set({
        top: this.frame.top ?? 0,
      });

      object.setCoords();
    }

    this.finishAlignment();
  };

  public alignMiddle = (id?: string) => {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    if (
      object.type === LayerType.ACTIVE_SELECTION
    ) {
      const top = object.top ?? 0;
      const height = object.getScaledHeight();

      this.alignSelection(
        object as ActiveSelection,
        'middle',
        (objectHeight) =>
          top +
          height / 2 -
          objectHeight / 2,
      );
    } else {
      object.set({
        top:
          (this.frame.top ?? 0) +
          (this.frame.height ?? 0) / 2 -
          object.getScaledHeight() / 2,
      });

      object.setCoords();
    }

    this.finishAlignment();
  };

  public alignBottom = (id?: string) => {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    if (
      object.type === LayerType.ACTIVE_SELECTION
    ) {
      const top = object.top ?? 0;
      const height = object.getScaledHeight();

      this.alignSelection(
        object as ActiveSelection,
        'bottom',
        (objectHeight) =>
          top +
          height -
          objectHeight,
      );
    } else {
      object.set({
        top:
          (this.frame.top ?? 0) +
          (this.frame.height ?? 0) -
          object.getScaledHeight(),
      });

      object.setCoords();
    }

    this.finishAlignment();
  };

  public alignLeft = (id?: string) => {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    if (
      object.type === LayerType.ACTIVE_SELECTION
    ) {
      this.alignSelection(
        object as ActiveSelection,
        'left',
        object.left ?? 0,
      );
    } else {
      object.set({
        left: this.frame.left ?? 0,
      });

      object.setCoords();
    }

    this.finishAlignment();
  };

  public alignCenter = (id?: string) => {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    if (
      object.type === LayerType.ACTIVE_SELECTION
    ) {
      const left = object.left ?? 0;
      const width = object.getScaledWidth();

      this.alignSelection(
        object as ActiveSelection,
        'center',
        (objectWidth) =>
          left +
          width / 2 -
          objectWidth / 2,
      );
    } else {
      object.set({
        left:
          (this.frame.left ?? 0) +
          (this.frame.width ?? 0) / 2 -
          object.getScaledWidth() / 2,
      });

      object.setCoords();
    }

    this.finishAlignment();
  };

  public alignRight = (id?: string) => {
    const object = this.getRefObject(id);

    if (!object) {
      return;
    }

    if (
      object.type === LayerType.ACTIVE_SELECTION
    ) {
      const left = object.left ?? 0;
      const width = object.getScaledWidth();

      this.alignSelection(
        object as ActiveSelection,
        'right',
        (objectWidth) =>
          left +
          width -
          objectWidth,
      );
    } else {
      object.set({
        left:
          (this.frame.left ?? 0) +
          (this.frame.width ?? 0) -
          object.getScaledWidth(),
      });

      object.setCoords();
    }

    this.finishAlignment();
  };

  private alignSelection(
    activeSelection: ActiveSelection,
    type:
      | 'top'
      | 'left'
      | 'middle'
      | 'center'
      | 'bottom'
      | 'right',
    calculator:
      | number
      | ((size: number) => number),
  ) {
    const selectedObjects =
      activeSelection.getObjects().slice();

    this.canvas.discardActiveObject();

    selectedObjects.forEach(
      (object: FabricObject) => {
        switch (type) {
          case 'top':
          case 'left':
            object.set(
              type,
              calculator as number,
            );
            break;

          case 'middle':
          case 'bottom':
            object.set(
              'top',
              (calculator as (
                size: number,
              ) => number)(
                object.getScaledHeight(),
              ),
            );
            break;

          case 'center':
          case 'right':
            object.set(
              'left',
              (calculator as (
                size: number,
              ) => number)(
                object.getScaledWidth(),
              ),
            );
            break;
        }

        object.setCoords();
      },
    );

    const selection =
      new ActiveSelection(
        selectedObjects,
        {
          canvas: this.canvas,
        },
      );

    this.canvas.setActiveObject(selection);
    this.state.setActiveObject(selection);
  }

  private finishAlignment() {
    const activeObject =
      this.canvas.getActiveObject();

    activeObject?.setCoords();

    this.canvas.requestRenderAll();

    this.state.setActiveObject(
      activeObject ?? null,
    );

    this.editor.history.save();
  }
}