import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_VPT } from './constants';
import { Editor } from '../../../engine';
import { TMat2D, FabricObject, Point } from 'fabric';

export function useCanvasPanning(editor: Editor) {
  const [spaceDown, setSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  const panRef = useRef<{ lastX: number; lastY: number } | null>(null);
  const originalSelectionRef = useRef<boolean>(true);

  const fabricCanvas = editor?.canvas?.canvas;

  useEffect(() => {
    if (!fabricCanvas) return;

    if (spaceDown) {
      originalSelectionRef.current = fabricCanvas.selection ?? true;
      fabricCanvas.selection = false;

      fabricCanvas.forEachObject((obj: FabricObject) => {
        obj.selectable = false;
        obj.evented = false;
      });
    } else {
      fabricCanvas.selection = originalSelectionRef.current;
      fabricCanvas.forEachObject((obj: FabricObject) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }
    fabricCanvas.requestRenderAll();
  }, [spaceDown, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleCanvasWheel = (opt: any) => {
      const evt = opt.e as WheelEvent;
      evt.preventDefault();
      evt.stopPropagation();

      const vpt = (fabricCanvas.viewportTransform
        ? [...fabricCanvas.viewportTransform]
        : [...DEFAULT_VPT]) as TMat2D;

      if (evt.ctrlKey) {
        const zoomFactor = 0.99;
        let zoom = fabricCanvas.getZoom();

        if (evt.deltaY < 0) {
          zoom /= zoomFactor;
        } else {
          zoom *= zoomFactor;
        }

        if (zoom > 4) zoom = 4;
        if (zoom < 0.05) zoom = 0.05;

        fabricCanvas.zoomToPoint(new Point(evt.offsetX, evt.offsetY), zoom);
      }
      // ЖЕСТ Б: Обычное панорамирование двумя пальцами в любую сторону
      else {
        vpt[4] -= evt.deltaX;
        vpt[5] -= evt.deltaY;
        fabricCanvas.setViewportTransform(vpt);
      }

      fabricCanvas.requestRenderAll();
    };

    fabricCanvas.on('mouse:wheel', handleCanvasWheel);

    return () => {
      fabricCanvas.off('mouse:wheel', handleCanvasWheel);
    };
  }, [fabricCanvas]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      const target = e.target as HTMLElement | null;
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
        setIsPanning(false);
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
    if (!spaceDown || !fabricCanvas) return;
    e.preventDefault();

    panRef.current = { lastX: e.clientX, lastY: e.clientY };
    setIsPanning(true);
  }, [spaceDown, fabricCanvas]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panRef.current || !isPanning || !fabricCanvas) return;

    const dx = e.clientX - panRef.current.lastX;
    const dy = e.clientY - panRef.current.lastY;

    const vpt = (fabricCanvas.viewportTransform
      ? [...fabricCanvas.viewportTransform]
      : [...DEFAULT_VPT]) as TMat2D;

    vpt[4] += dx;
    vpt[5] += dy;

    fabricCanvas.setViewportTransform(vpt);
    fabricCanvas.requestRenderAll();

    panRef.current = { lastX: e.clientX, lastY: e.clientY };
  }, [isPanning, fabricCanvas]);

  const handleMouseUp = useCallback(() => {
    panRef.current = null;
    setIsPanning(false);
  }, []);

  return {
    spaceDown,
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
