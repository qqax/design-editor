'use client';

import { useEffect, useRef, useState } from 'react';

import type { Editor } from '../engine';

export const AUTOSAVE_KEY_PREFIX = 'design_autosave';
export const getAutosaveKey = (sceneKey?: string) =>
  sceneKey ? `${AUTOSAVE_KEY_PREFIX}_${sceneKey}` : AUTOSAVE_KEY_PREFIX;

/**
 * Масштаб и положение рабочей области. Положение хранится как точка сцены в
 * центре холста относительно центра фрейма, а не как сырой viewportTransform:
 * при импорте фрейм заново центрируется, а размер окна после перезагрузки
 * может быть другим.
 */
export interface AutosaveViewport {
  zoom: number;
  x: number;
  y: number;
}

export function getViewport(editor: Editor): AutosaveViewport | undefined {
  try {
    const { canvas } = editor.canvas;
    const [zoom, , , , tx, ty] = canvas.viewportTransform;
    const frameCenter = editor.frame.frame.getCenterPoint();
    return {
      zoom,
      x: (canvas.width / 2 - tx) / zoom - frameCenter.x,
      y: (canvas.height / 2 - ty) / zoom - frameCenter.y,
    };
  } catch {
    return undefined;
  }
}

export function restoreViewport(editor: Editor, viewport: AutosaveViewport) {
  const { zoom, x, y } = viewport;
  if (![zoom, x, y].every((v) => Number.isFinite(v)) || zoom <= 0) return;

  const { canvas } = editor.canvas;
  const frameCenter = editor.frame.frame.getCenterPoint();
  canvas.setViewportTransform([
    zoom,
    0,
    0,
    zoom,
    canvas.width / 2 - (frameCenter.x + x) * zoom,
    canvas.height / 2 - (frameCenter.y + y) * zoom,
  ]);
  canvas.requestRenderAll();
  editor.state.setZoomRatio(zoom);
}

export function useAutoSave(
  editor: Editor | null,
  canvasBg: string,
  workspaceBg: string,
  sceneKey?: string
) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const key = getAutosaveKey(sceneKey);

  // Флаг для пропуска первоначального рендера, чтобы не затирать автосохранение при загрузке страницы
  const isFirstRender = useRef(true);

  // Setup beforeunload to prevent accidental exit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Единая функция для планирования автосохранения
  const scheduleSave = useRef<() => void>(undefined);
  useEffect(() => {
    scheduleSave.current = () => {
      setHasUnsavedChanges(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!editor) return;
        try {
          const payload = {
            scene: editor.scene.exportToJSON(),
            canvasBg,
            workspaceBg,
            viewport: getViewport(editor),
          };
          localStorage.setItem(key, JSON.stringify(payload));
        } catch {
          /* empty */
        }
      }, 1500);
    };
  });

  // 1. Отслеживание изменений объектов внутри Fabric.js
  useEffect(() => {
    if (!editor) return;

    const canvas = editor.canvas?.canvas;
    if (!canvas) return;

    const triggerSave = () => scheduleSave.current?.();

    canvas.on('object:modified', triggerSave);
    canvas.on('object:added', triggerSave);
    canvas.on('object:removed', triggerSave);

    return () => {
      canvas.off('object:modified', triggerSave);
      canvas.off('object:added', triggerSave);
      canvas.off('object:removed', triggerSave);
    };
  }, [editor]);

  // 2. Изменения фрейма: размер и фон
  useEffect(() => {
    if (!editor) return;

    const triggerSave = () => scheduleSave.current?.();

    editor.frame?.on?.('modified', triggerSave);

    return () => {
      editor.frame?.off?.('modified', triggerSave);
    };
  }, [editor]);

  // 3. Масштаб и панорамирование — не правка документа и не должны помечать
  // изменения несохранёнными, поэтому отдельного сохранения на них нет:
  // текущий вид дописывается в существующее автосохранение при уходе со
  // страницы, в том числе при hard reload.
  useEffect(() => {
    if (!editor) return;

    const saveViewport = () => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const payload = JSON.parse(raw) as Record<string, unknown>;
        payload.viewport = getViewport(editor);
        localStorage.setItem(key, JSON.stringify(payload));
      } catch {
        /* empty */
      }
    };

    window.addEventListener('pagehide', saveViewport);
    return () => window.removeEventListener('pagehide', saveViewport);
  }, [editor, key]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    scheduleSave.current?.();
  }, [canvasBg, workspaceBg]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return { hasUnsavedChanges, setHasUnsavedChanges };
}

export function loadAutosave(sceneKey?: string): any {
  try {
    const raw = localStorage.getItem(getAutosaveKey(sceneKey));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAutosave(sceneKey?: string) {
  localStorage.removeItem(getAutosaveKey(sceneKey));
}
