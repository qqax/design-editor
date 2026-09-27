import { ActiveSelection, Group } from 'fabric';

import { LayerType } from '../../../types';
import { generateId } from '../../utils/id';
import { createLayerName } from '../../utils/layer-name';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsGrouping {
  constructor(private readonly context: ObjectsContext) {}

  public group = () => {
    const { canvas, editor } = this.context;
    const activeObject = canvas.getActiveObject();

    if (!(activeObject instanceof ActiveSelection)) {
      return;
    }

    // The selection releases its objects but leaves them on the canvas.
    const objects = activeObject.removeAll();
    const stack = canvas.getObjects();
    const topmost = Math.max(...objects.map((object) => stack.indexOf(object)));
    canvas.discardActiveObject();
    canvas.remove(...objects);

    const taken = new Set(
      canvas.getObjects().map((object) => String(object.name ?? ''))
    );
    const group = new Group(objects, {
      id: generateId(),
      name: createLayerName(
        LayerType.GROUP,
        undefined,
        taken,
        editor.layerLabels
      ),
      subTargetCheck: true,
    } as never);

    canvas.insertAt(topmost - objects.length + 1, group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();

    editor.history.save();
    this.context.updateContextObjects();
    this.context.state.setActiveObject(group);
  };

  public ungroup = () => {
    const { canvas, editor, config } = this.context;
    const group = canvas.getActiveObject();

    if (!(group instanceof Group) || group instanceof ActiveSelection) {
      return;
    }

    const index = canvas.getObjects().indexOf(group);
    const objects = group.removeAll();
    canvas.remove(group);
    canvas.insertAt(index, ...objects);

    objects.forEach((object) => {
      object.set({
        clipPath: config.clipToFrame ? editor.frame.frame : undefined,
      });
      object.setCoords();
    });

    const selection = new ActiveSelection(objects, { canvas });
    canvas.setActiveObject(selection);
    canvas.requestRenderAll();

    editor.history.save();
    this.context.updateContextObjects();
    this.context.state.setActiveObject(selection);
  };
}

export default ObjectsGrouping;
