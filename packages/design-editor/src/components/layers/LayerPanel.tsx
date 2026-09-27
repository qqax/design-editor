'use client';

import React, { useCallback, useState } from 'react';

import { Folder, X } from 'lucide-react';

import { useMessages } from '../../messages';
import { Tooltip } from '../primitives';
import { LayerList } from './LayerList';
import { useLayerPanel } from './useLayerPanel';

interface LayerPanelProps {
  editor: any;
  onClose: () => void;
}

export function LayerPanel({ editor, onClose }: LayerPanelProps) {
  const m = useMessages().layers;
  const { layers, activeId } = useLayerPanel();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = useCallback(
    (id: string, multi: boolean) => {
      setSelectedIds((prev) => {
        if (multi) {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        }
        return new Set([id]);
      });
      editor?.objects?.select?.(id);
    },
    [editor]
  );

  const handleVisibilityChange = useCallback(
    (id: string, visible: boolean) => {
      editor?.objects?.update?.({ visible }, id);
    },
    [editor]
  );

  const handleDelete = useCallback(
    (id: string) => {
      editor?.objects?.remove?.(id);
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
      editor?.objects?.clone?.(id);
    },
    [editor]
  );

  const handleRename = useCallback(
    (id: string, name: string) => {
      editor?.objects?.update?.({ name }, id);
    },
    [editor]
  );

  const handleGroup = useCallback(() => {
    if (selectedIds.size < 2) return;
    editor?.objects?.group?.([...selectedIds]);
    setSelectedIds(new Set());
  }, [editor, selectedIds]);

  return (
    <div
      className="de-layer-panel"
      style={{
        background: 'var(--de-color-surface)',
        borderLeft: '1px solid var(--de-color-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--de-shadow-md)',
      }}
    >
      {/* Header */}
      <div className="de-sidebar-header">
        <span>{m.title}</span>
        <div style={{ display: 'flex', gap: 2 }}>
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
      <div style={{ flex: 1, overflowY: 'auto' }}>
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
