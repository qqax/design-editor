'use client';

import { useState } from 'react';

import { useToast } from './useToast';
import { useEditorContext } from '../components/EditorContext';

export function useStudioExport() {
  const [exporting, setExporting] = useState(false);
  const toast = useToast();
  const { onExport } = useEditorContext();

  async function exportToLibrary(
    blob: Blob,
    filename: string,
    scene: any
  ): Promise<boolean> {
    setExporting(true);
    try {
      if (onExport) {
        await onExport(blob, filename.endsWith('.png') ? 'png' : 'jpg', scene);
      }
      toast.success('Saved to Media Library');
      return true;
    } catch {
      toast.error('Failed to save — please try again');
      return false;
    } finally {
      setExporting(false);
    }
  }

  return { exportToLibrary, exporting };
}
