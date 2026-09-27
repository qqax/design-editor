'use client';

import React, { useCallback, useState } from 'react';

import { Folder, X } from 'lucide-react';

import { useMessages } from '../../messages';
import { Tooltip } from '../primitives';
import { LayerList } from './LayerList';
import { useLayerPanel } from './useLayerPanel';

import type { Editor } from '../../engine';

interface LayerPanelProps {
  editor: Editor | null;
  onClose: () => void;
}

export function LayerPanel({ editor, onClose }: LayerPanelProps) {
  const m = useMessages().layers;
  const { layers, activeId } = useLayerPanel();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = useCallback(
    (id: string, multi: boolean) => {
      const next = new Set(multi ? selectedIds : []);
      if (multi && next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedIds(next);
      editor?.objects.selectMany([...next]);
    },
    [editor, selectedIds]
  );

  const handleVisibilityChange = useCallback(
    (id: string, visible: boolean) => {
      editor?.objects.update({ visible }, id);
    },
    [editor]
  );

  const handleDelete = useCallback(
    (id: string) => {
      editor?.objects.remove(id);
      setSelectedIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [editor]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      if (!editor) return;
      editor.objects.select(id);
      void editor.objects.clone();
    },
    [editor]
  );

  const handleRename = useCallback(
    (id: string, name: string) => {
      editor?.objects.update({ name }, id);
    },
    [editor]
  );

  const handleGroup = useCallback(() => {
    if (!editor || selectedIds.size < 2) return;
    editor.objects.selectMany([...selectedIds]);
    editor.objects.group();
    setSelectedIds(new Set());
  }, [editor, selectedIds]);

  return (
    <div className="de-layer-panel">
      {/* Header */}
      <div className="de-sidebar-header">
        <span>{m.title}</span>
        <div className="de-header-actions">
          {selectedIds.size >= 2 && (
            <Tooltip title={m.group}>
              <button
                aria-label={m.group}
                className="de-icon-btn"
                onClick={handleGroup}
                type="button"
              >
                <Folder size={15} />
              </button>
            </Tooltip>
          )}
          <Tooltip title={m.close}>
            <button
              aria-label={m.close}
              className="de-icon-btn"
              onClick={onClose}
              type="button"
            >
              <X size={15} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Layer list */}
      <div className="de-layer-list">
        <LayerList
          activeId={activeId}
          layers={layers}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onRename={handleRename}
          onSelect={handleSelect}
          onVisibilityChange={handleVisibilityChange}
          selectedIds={selectedIds}
        />
      </div>

      <div className="de-panel-hint">{m.hint}</div>
    </div>
  );
}
