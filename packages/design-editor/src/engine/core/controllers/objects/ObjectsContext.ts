import type { Canvas, FabricObject } from 'fabric';

export interface ObjectsContext {
  canvas: Canvas;
  editor: any;
  state: any;
  config: any;

  getRefObject: (id?: string) => FabricObject | null;
  findOneById: (id: string) => FabricObject | null;
  updateContextObjects: () => void;
}

export interface ObjectsManagerContext extends ObjectsContext {
  unsetBackgroundImage: () => Promise<any>;
}