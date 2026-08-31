import { useCallback, useState } from 'react';
import { DEFAULT_VPT } from './constants';

export function useCanvasDrop(editor: any, addImageToCanvas: any, handleAddMedia: any) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!editor) return;

    const shapeSrc = e.dataTransfer.getData('text/x-qqax-shape-src');
    const stickerSrc = e.dataTransfer.getData('text/x-qqax-sticker-src');
    const mediaUrl = e.dataTransfer.getData('text/x-qqax-url');

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let left = e.clientX - rect.left;
    let top = e.clientY - rect.top;

    try {
      const zoom = editor.canvas.canvas.getZoom() || 1;
      const vpt = editor.canvas.canvas.viewportTransform || DEFAULT_VPT;
      left = (left - vpt[4]) / zoom;
      top = (top - vpt[5]) / zoom;
    } catch {}

    if (shapeSrc || stickerSrc) {
      addImageToCanvas(shapeSrc || stickerSrc, top, left);
    } else if (mediaUrl) {
      await handleAddMedia(mediaUrl, { top, left });
    }
  }, [editor, addImageToCanvas, handleAddMedia]);

  return {
    dragOver,
    setDragOver,
    handleDrop,
  };
}
