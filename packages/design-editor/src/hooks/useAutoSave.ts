'use client';

import { useEffect, useRef, useState } from 'react';

export const AUTOSAVE_KEY_PREFIX = 'design_autosave';
export const getAutosaveKey = (sceneKey?: string) =>
  sceneKey ? `${AUTOSAVE_KEY_PREFIX}_${sceneKey}` : AUTOSAVE_KEY_PREFIX;

export function useAutoSave(
  editor: any,
  canvasBg: string,
  workspaceBg: string,
  sceneKey?: string
) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const key = getAutosaveKey(sceneKey);

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

  // Track fabric.js changes
  useEffect(() => {
    if (!editor) return;
    const canvas = editor.canvas?.canvas;
    if (!canvas) return;
    const schedule = () => {
      setHasUnsavedChanges(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        try {
          const payload = {
            scene: editor.scene.exportToJSON(),
            canvasBg,
            workspaceBg,
          };
          localStorage.setItem(key, JSON.stringify(payload));
        } catch {
          /* empty */
        }
      }, 1500);
    };
    canvas.on('object:modified', schedule);
    canvas.on('object:added', schedule);
    canvas.on('object:removed', schedule);
    return () => {
      canvas.off('object:modified', schedule);
      canvas.off('object:added', schedule);
      canvas.off('object:removed', schedule);
      clearTimeout(timerRef.current);
    };
  }, [editor, canvasBg, workspaceBg, key]);

  // Track background changes explicitly
  useEffect(() => {
    if (!editor) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        setHasUnsavedChanges(true);
        const payload = {
          scene: editor.scene.exportToJSON(),
          canvasBg,
          workspaceBg,
        };
        localStorage.setItem(key, JSON.stringify(payload));
      } catch {
        /* empty */
      }
    }, 1500);

    return () => clearTimeout(timerRef.current);
  }, [canvasBg, workspaceBg, editor, key]);

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
