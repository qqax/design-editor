import { useCallback, useEffect, useRef, useState } from 'react';

import { Point } from 'fabric';

import { DEFAULT_VPT } from './constants';

import type { FabricObject, TMat2D } from 'fabric';
import type React from 'react';

import type { Editor } from '../../../engine';

export function useCanvasPanning(editor: Editor | null) {
  const [spaceDown, setSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  const panRef = useRef<{ lastX: number; lastY: number } | null>(null);
  const originalSelectionRef = useRef<boolean>(true);

  // FIX: Storing the editor in a Ref entirely shields the compiler from
  // worrying about mutations across async effect boundaries.
  const editorRef = useRef<Editor | null>(null);
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    const fabricCanvas = editorRef.current?.canvas?.canvas;
    if (!fabricCanvas) return;

    if (spaceDown) {
      originalSelectionRef.current = fabricCanvas.selection ?? true;
      fabricCanvas.set('selection', false);

      fabricCanvas.forEachObject((obj: FabricObject) => {
        obj.set({
          selectable: false,
          evented: false,
        });
      });
    } else {
      fabricCanvas.set('selection', originalSelectionRef.current);
      fabricCanvas.forEachObject((obj: FabricObject) => {
        obj.set({
          selectable: true,
          evented: true,
        });
      });
    }
    fabricCanvas.requestRenderAll();
  }, [spaceDown]); // No more 'editor' variable mutation dependencies!

  useEffect(() => {
    const fabricCanvas = editorRef.current?.canvas?.canvas;
    if (!fabricCanvas) return;

    const handleCanvasWheel = (opt: any) => {
      const currentCanvas = editorRef.current?.canvas?.canvas;
      if (!currentCanvas) return;

      const evt = opt.e as WheelEvent;
      evt.preventDefault();
      evt.stopPropagation();

      const vpt = (
        currentCanvas.viewportTransform
          ? [...currentCanvas.viewportTransform]
          : [...DEFAULT_VPT]
      ) as TMat2D;

      if (evt.ctrlKey) {
        const zoomFactor = 0.99;
        let zoom = currentCanvas.getZoom();

        if (evt.deltaY < 0) {
          zoom /= zoomFactor;
        } else {
          zoom *= zoomFactor;
        }

        if (zoom > 4) zoom = 4;
        if (zoom < 0.05) zoom = 0.05;

        currentCanvas.zoomToPoint(new Point(evt.offsetX, evt.offsetY), zoom);
      } else {
        vpt[4] -= evt.deltaX;
        vpt[5] -= evt.deltaY;
        currentCanvas.setViewportTransform(vpt);
      }

      currentCanvas.requestRenderAll();
    };

    fabricCanvas.on('mouse:wheel', handleCanvasWheel);

    return () => {
      fabricCanvas.off('mouse:wheel', handleCanvasWheel);
    };
  }, []); // Run on mount/unmount safely

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

  // 4. Mouse Down Handler (Space + Click)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const fabricCanvas = editorRef.current?.canvas?.canvas;
      if (!spaceDown || !fabricCanvas) return;
      e.preventDefault();

      panRef.current = { lastX: e.clientX, lastY: e.clientY };
      setIsPanning(true);
    },
    [spaceDown]
  );

  // 5. Mouse Move Handler (Space + Drag)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const fabricCanvas = editorRef.current?.canvas?.canvas;
      if (!panRef.current || !isPanning || !fabricCanvas) return;

      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;

      const vpt = (
        fabricCanvas.viewportTransform
          ? [...fabricCanvas.viewportTransform]
          : [...DEFAULT_VPT]
      ) as TMat2D;

      vpt[4] += dx;
      vpt[5] += dy;

      fabricCanvas.setViewportTransform(vpt);
      fabricCanvas.requestRenderAll();

      panRef.current = { lastX: e.clientX, lastY: e.clientY };
    },
    [isPanning]
  );

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
