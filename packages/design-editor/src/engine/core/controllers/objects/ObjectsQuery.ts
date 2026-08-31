import { Group, type FabricObject } from 'fabric';

import { LayerType } from '../../../types';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsQuery {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  public findByIdInObjects = (
    id: string,
    objects: FabricObject[],
  ): FabricObject | null => {
    for (const object of objects) {
      if (object.id === id) {
        return object;
      }

      if (object instanceof Group) {
        const children = object.getObjects();

        if (!children.length) {
          continue;
        }

        const nestedObject =
          this.findByIdInObjects(
            id,
            children,
          );

        if (nestedObject) {
          return nestedObject;
        }
      }
    }

    return null;
  };

  public findOneById = (
    id: string,
  ): FabricObject | null => {
    return this.findByIdInObjects(
      id,
      this.context.canvas.getObjects(),
    );
  };

  public findById = (id: string) => {
    const object = this.findOneById(id);

    return object ? [object] : [];
  };

  public findByName = (name: string) => {
    return this.context.canvas
      .getObjects()
      .filter(
        (object) => object.name === name,
      );
  };

  public list = () => {
    return this.context.canvas
      .getObjects()
      .filter((object) => {
        return (
          object.type !== LayerType.FRAME &&
          object.type !== LayerType.BACKGROUND
        );
      });
  };
}

export default ObjectsQuery;