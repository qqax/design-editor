import {
  ActiveSelection,
} from 'fabric';

import { LayerType } from '../../../types';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsSelection {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  public select = (id?: string) => {
    const { canvas, state } = this.context;

    canvas.discardActiveObject();

    if (id) {
      const object = this.context.findOneById(id);

      if (!object) {
        return;
      }

      canvas.disableEvents();

      canvas.setActiveObject(object);

      if (object.group) {
        object.hasControls = false;
      }

      canvas.enableEvents();

      canvas.requestRenderAll();

      state.setActiveObject(
        canvas.getActiveObject() ?? null,
      );

      return;
    }

    const selectableObjects = canvas
      .getObjects()
      .filter((object) => {
        if (
          object.type === LayerType.FRAME ||
          object.type === LayerType.BACKGROUND
        ) {
          return false;
        }

        if (!object.evented) {
          return false;
        }

        return !object.locked;
      });

    if (!selectableObjects.length) {
      state.setActiveObject(null);
      return;
    }

    if (selectableObjects.length === 1) {
      const [object] = selectableObjects;

      canvas.setActiveObject(object);
      canvas.requestRenderAll();

      state.setActiveObject(object);

      return;
    }

    const activeSelection = new ActiveSelection(
      selectableObjects,
      {
        canvas,
      },
    );

    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();

    state.setActiveObject(activeSelection);
  };

  public deselect = () => {
    this.context.canvas.discardActiveObject();
    this.context.canvas.requestRenderAll();

    this.context.state.setActiveObject(null);
  };
}

export default ObjectsSelection;