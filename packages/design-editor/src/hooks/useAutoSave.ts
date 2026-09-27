'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { createAutosaveStore } from './autosaveStore';

import type { AutosavePayload, AutosaveViewport } from './autosaveStore';
import type { CanvasBackground, Editor } from '../engine';
import type { PersistenceProvider } from '../providers';

export type { AutosavePayload, AutosaveViewport } from './autosaveStore';

export const AUTOSAVE_KEY_PREFIX = 'design_autosave';
export const getAutosaveKey = (sceneKey?: string) =>
  sceneKey ? `${AUTOSAVE_KEY_PREFIX}_${sceneKey}` : AUTOSAVE_KEY_PREFIX;

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
  canvasBg: CanvasBackground,
  workspaceBg: string,
  persistence: PersistenceProvider,
  sceneKey?: string
) {
  const store = useMemo(() => createAutosaveStore(persistence), [persistence]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const key = getAutosaveKey(sceneKey);

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

  const scheduleSave = useRef<() => void>(undefined);
  useEffect(() => {
    scheduleSave.current = () => {
      setHasUnsavedChanges(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!editor) return;
        try {
          void store
            .save(key, {
              scene: editor.scene.exportToJSON(),
              canvasBg,
              workspaceBg,
              viewport: getViewport(editor),
            })
            .catch(() => {});
        } catch {
          /* empty */
        }
      }, 1500);
    };
  });

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

  useEffect(() => {
    if (!editor) return;

    const triggerSave = () => scheduleSave.current?.();

    editor.frame?.on?.('modified', triggerSave);
    editor.on('history:changed', triggerSave);

    return () => {
      editor.frame?.off?.('modified', triggerSave);
      editor.off('history:changed', triggerSave);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const saveViewport = () => {
      const viewport = getViewport(editor);
      if (viewport) store.saveViewport(key, viewport);
    };

    window.addEventListener('pagehide', saveViewport);
    return () => window.removeEventListener('pagehide', saveViewport);
  }, [editor, key, store]);

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

export async function loadAutosave(
  persistence: PersistenceProvider,
  sceneKey?: string
): Promise<AutosavePayload | null> {
  return createAutosaveStore(persistence)
    .load(getAutosaveKey(sceneKey))
    .catch(() => null);
}

export async function clearAutosave(
  persistence: PersistenceProvider,
  sceneKey?: string
): Promise<void> {
  return createAutosaveStore(persistence)
    .clear(getAutosaveKey(sceneKey))
    .catch(() => {});
}
