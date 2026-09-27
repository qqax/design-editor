import type { Canvas, FabricObject } from 'fabric';

import type { Editor } from '../../../engine';

type AddedHandler = (event: { target: FabricObject }) => void;

const addedHandlers = new WeakMap<Canvas, AddedHandler>();

/** Rotation snapping lives on objects, so it is set on every current and future one */
export const applyEditorSettings = (editor: Editor, snapGrid?: boolean) => {
  const { canvas } = editor.canvas;
  const snap = {
    snapAngle: snapGrid ? 45 : undefined,
    snapThreshold: snapGrid ? 10 : undefined,
  };

  canvas.getObjects().forEach((object) => object.set(snap));

  const previous = addedHandlers.get(canvas);
  if (previous) canvas.off('object:added', previous);
  const handler: AddedHandler = ({ target }) => target.set(snap);
  canvas.on('object:added', handler);
  addedHandlers.set(canvas, handler);

  editor.canvas.requestRenderAll();
};
