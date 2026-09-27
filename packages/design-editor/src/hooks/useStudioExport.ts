'use client';

import { useState } from 'react';

import { useToast } from './useToast';
import { useEditorContext } from '../components/EditorContext';

import type { ExportFormat, IScene } from '../engine';

export function useStudioExport() {
  const [exporting, setExporting] = useState(false);
  const toast = useToast();
  const { onExport } = useEditorContext();

  async function exportToLibrary(
    blob: Blob,
    format: ExportFormat,
    scene: IScene
  ): Promise<boolean> {
    if (!onExport) return false;
    setExporting(true);
    try {
      await onExport(blob, format, scene);
      toast.success('Saved to Media Library');
      return true;
    } catch {
      toast.error('Failed to save — please try again');
      return false;
    } finally {
      setExporting(false);
    }
  }

  return { exportToLibrary, exporting, canSaveToLibrary: Boolean(onExport) };
}
