'use client';

import { useEffect, useRef, useState } from 'react';

import type { Editor } from '../engine';

export const AUTOSAVE_KEY_PREFIX = 'design_autosave';
export const getAutosaveKey = (sceneKey?: string) =>
  sceneKey ? `${AUTOSAVE_KEY_PREFIX}_${sceneKey}` : AUTOSAVE_KEY_PREFIX;

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
  const scheduleSave = useRef<() => void>();
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
        };
        localStorage.setItem(key, JSON.stringify(payload));
      } catch {
        /* empty */
      }
    }, 1500);
  };

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

  // 2. Отслеживание внешних событий движка (Изменение фрейма/истории)
  useEffect(() => {
    if (!editor) return;

    const triggerSave = () => scheduleSave.current?.();

    editor.frame?.on?.('modified', triggerSave);
    editor.on?.('frame:resize', triggerSave); // Проверьте точное название события изменения фрейма в вашем движке!

    return () => {
      editor.frame?.off?.('modified', triggerSave);
      editor.on?.('frame:resize', triggerSave);
    };
  }, [editor]);

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
