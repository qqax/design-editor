import { useCallback, useState } from 'react';

import type { PagePoint } from './useEditorActions';
import type { Editor } from '../../../engine';

/** Drops from the side panels land centred on the pointer */
export function useCanvasDrop(
  editor: Editor | null,
  addImageToCanvas: (url: string, at: PagePoint) => Promise<void>,
  handleAddMedia: (url: string, at: PagePoint) => Promise<void>
) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!editor) return;

      const shapeSrc = e.dataTransfer.getData('text/x-qqax-shape-src');
      const stickerSrc = e.dataTransfer.getData('text/x-qqax-sticker-src');
      const mediaUrl = e.dataTransfer.getData('text/x-qqax-url');

      const rect = e.currentTarget.getBoundingClientRect();
      const [zoom, , , , panX, panY] = editor.canvas.canvas.viewportTransform;
      const page = editor.frame.frame;
      const at: PagePoint = {
        left: (e.clientX - rect.left - panX) / (zoom || 1) - page.left,
        top: (e.clientY - rect.top - panY) / (zoom || 1) - page.top,
      };

      if (shapeSrc || stickerSrc) {
        await addImageToCanvas(shapeSrc || stickerSrc, at);
      } else if (mediaUrl) {
        await handleAddMedia(mediaUrl, at);
      }
    },
    [editor, addImageToCanvas, handleAddMedia]
  );

  return {
    dragOver,
    setDragOver,
    handleDrop,
  };
}
