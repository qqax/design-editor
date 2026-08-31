import {
  ActiveSelection,
  Group,
} from 'fabric';

import { LayerType } from '../../../types';

import { generateId } from '../../utils/id';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsGrouping {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  public group = () => {
    const activeObject =
      this.context.canvas.getActiveObject();

    if (
      !activeObject ||
      activeObject.type !== LayerType.ACTIVE_SELECTION
    ) {
      return;
    }

    const selection =
      activeObject as ActiveSelection;

    const objects = selection.removeAll();

    const group = new Group(objects, {
      name: 'group',
      id: generateId(),
      subTargetCheck: true,
    } as any);

    this.context.canvas.add(group);
    this.context.canvas.setActiveObject(group);

    this.context.canvas.requestRenderAll();

    this.context.editor.history.save();
    this.context.updateContextObjects();
    this.context.state.setActiveObject(group);
  };

  public ungroup = () => {
    const activeObject =
      this.context.canvas.getActiveObject();

    if (
      !activeObject ||
      activeObject.type !==
      LayerType.GROUP.toLowerCase()
    ) {
      return;
    }

    const group = activeObject as Group;

    group.clipPath = undefined;

    const objects = group.removeAll();

    this.context.canvas.remove(group);

    const activeSelection = new ActiveSelection(
      objects,
      {
        canvas: this.context.canvas,
      },
    );

    activeSelection.getObjects().forEach(
      (object) => {
        if (this.context.config.clipToFrame) {
          object.clipPath =
            this.context.editor.frame.frame as any;
        }

        object.setCoords();
      },
    );

    this.context.canvas.setActiveObject(
      activeSelection,
    );

    this.context.canvas.requestRenderAll();

    this.context.editor.history.save();
    this.context.updateContextObjects();
    this.context.state.setActiveObject(
      activeSelection,
    );
  };
}

export default ObjectsGrouping;