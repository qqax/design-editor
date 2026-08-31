import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_VPT } from './constants';

export function useCanvasPanning(editor: any) {
  const [spaceDown, setSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{ startX: number; startY: number; vpt: readonly number[] } | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInputElement =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'BUTTON' ||
        target.role === 'button' ||
        target.role === 'combobox' ||
        target.role === 'option' ||
        target.isContentEditable;

      if (isInputElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      e.preventDefault();
      setSpaceDown(true);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpaceDown(false);
        panRef.current = null;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!spaceDown || !editor) return;
    e.preventDefault();
    const fabricCanvas = editor.canvas?.canvas;
    if (!fabricCanvas) return;

    const vpt = fabricCanvas.viewportTransform
      ? [...fabricCanvas.viewportTransform]
      : DEFAULT_VPT;
    panRef.current = { startX: e.clientX, startY: e.clientY, vpt };
    setIsPanning(true);
  }, [spaceDown, editor]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panRef.current || !editor) return;
    const fabricCanvas = editor.canvas?.canvas;
    if (!fabricCanvas) return;

    const dx = e.clientX - panRef.current.startX;
    const dy = e.clientY - panRef.current.startY;
    const vpt = [...panRef.current.vpt];
    vpt[4] += dx;
    vpt[5] += dy;

    fabricCanvas.setViewportTransform(vpt);
    fabricCanvas.requestRenderAll();
  }, [editor]);

  const handleMouseUp = useCallback(() => {
    if (panRef.current) {
      panRef.current = null;
      setIsPanning(false);
    }
  }, []);

  return {
    spaceDown,
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
