import type { FabricObject } from 'fabric';

import { LayerType } from '../../../types';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsState {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  public sync = () => {
    const objects = this.context.canvas
      .getObjects()
      .filter((object: FabricObject) => {
        return (
          object.type !== LayerType.FRAME &&
          object.type !== LayerType.BACKGROUND
        );
      });

    this.context.state.setObjects(objects);
  };

  public setActiveObject = (
    object: FabricObject | null,
  ) => {
    this.context.state.setActiveObject(object);
  };
}

export default ObjectsState;