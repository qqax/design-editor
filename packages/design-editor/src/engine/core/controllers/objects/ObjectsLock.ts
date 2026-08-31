import type { FabricObject } from 'fabric';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsLock {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  private getObjects = (
    object: FabricObject,
  ): FabricObject[] => {
    return (object as any)._objects ?? [object];
  };

  public lock = (id?: string) => {
    const refObject =
      this.context.getRefObject(id);

    if (!refObject) {
      return;
    }

    this.getObjects(refObject).forEach(
      (object) => {
        object.set({
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
          locked: true,
        } as any);
      },
    );

    refObject.set({
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      locked: true,
    } as any);

    this.context.canvas.requestRenderAll();

    this.context.editor.history.save();
    this.context.updateContextObjects();
  };

  public unlock = (id?: string) => {
    const refObject =
      this.context.getRefObject(id);

    if (!refObject) {
      return;
    }

    this.getObjects(refObject).forEach(
      (object) => {
        object.set({
          hasControls: true,
          lockMovementX: false,
          lockMovementY: false,
          locked: false,
        } as any);
      },
    );

    refObject.set({
      hasControls: true,
      lockMovementX: false,
      lockMovementY: false,
      locked: false,
    } as any);

    this.context.canvas.requestRenderAll();

    this.context.editor.history.save();
    this.context.updateContextObjects();
  };
}

export default ObjectsLock;