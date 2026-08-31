import { Gradient } from 'fabric';
import { pick } from 'lodash';

import {
  copyStyleProps,
  getCopyStyleCursor,
} from '../../common/constants';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsStyleClipboard {
  public clipboard: {
    objectType: string;
    props: Record<string, any>;
  } | null = null;

  constructor(
    private readonly context: ObjectsContext,
  ) {}

  public copy = () => {
    const activeObject =
      this.context.canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    const clonableProps =
      copyStyleProps[
        activeObject.type as keyof typeof copyStyleProps
        ];

    if (!clonableProps) {
      return;
    }

    const clonedProps = pick(
      activeObject.toJSON(),
      clonableProps,
    );

    this.clipboard = {
      objectType: activeObject.type,
      props: clonedProps,
    };

    const cursor = getCopyStyleCursor();

    this.context.editor.frame.setHoverCursor(
      cursor,
    );

    this.context.canvas.hoverCursor = cursor;
    this.context.canvas.defaultCursor = cursor;
  };

  public paste = () => {
    const activeObject =
      this.context.canvas.getActiveObject();

    const clipboard = this.clipboard;

    if (
      activeObject &&
      clipboard &&
      activeObject.type === clipboard.objectType
    ) {
      const { fill, ...basicProps } =
        clipboard.props;

      activeObject.set(basicProps);

      if (fill !== undefined) {
        if (
          fill &&
          typeof fill === 'object' &&
          fill.type
        ) {
          activeObject.set({
            fill: new Gradient(fill),
          });
        } else {
          activeObject.set({
            fill,
          });
        }
      }

      activeObject.setCoords();

      this.context.canvas.requestRenderAll();

      this.context.editor.history.save();
      this.context.updateContextObjects();
    }

    this.clipboard = null;

    this.context.editor.frame.setHoverCursor(
      'default',
    );

    this.context.canvas.hoverCursor = 'move';
    this.context.canvas.defaultCursor = 'default';
  };
}

export default ObjectsStyleClipboard;