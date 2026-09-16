import type { Editor } from '../../../engine';

export const applyEditorSettings = (
  editor: InstanceType<typeof Editor>,
  snapGrid?: boolean
) => {
  const fabricCanvas = editor.canvas.canvas as any;

  fabricCanvas.snapThreshold = snapGrid ? 10 : undefined;
  fabricCanvas.snapAngle = snapGrid ? 45 : undefined;

  editor.canvas.requestRenderAll();
};
