'use client';

import React, { useCallback, useState } from 'react';

import { Folder, X } from 'lucide-react';

import { Tooltip } from '../primitives';
import { ICON_BTN } from './layer-panel.types';
import { LayerList } from './LayerList';
import { useLayerPanel } from './useLayerPanel';

interface LayerPanelProps {
  editor: any;
  onClose: () => void;
}

export function LayerPanel({ editor, onClose }: LayerPanelProps) {
  const { layers, activeId } = useLayerPanel();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = useCallback(
    (id: string, multi: boolean) => {
      setSelectedIds((prev) => {
        if (multi) {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
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
      console.log(visible, id);
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
      className="absolute bottom-[66px] right-0 top-[56px] z-40 w-full shrink-0 animate-[panelSlideIn_0.2s_cubic-bezier(0.4,0,0.2,1)] md:relative md:bottom-0 md:top-0 md:z-auto md:w-[230px]"
      style={{
        background: 'color-mix(in srgb, var(--color-surface) 97%, transparent)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '-8px 0 40px var(--shadow-color)',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 50,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            width: 3,
            height: 16,
            borderRadius: 2,
            background: 'var(--color-primary)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            flex: 1,
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
          }}
        >
          Layers
        </span>

        {selectedIds.size >= 2 && (
          <Tooltip title="Group selected layers">
            <button onClick={handleGroup} style={ICON_BTN}>
              <Folder size={14} />
            </button>
          </Tooltip>
        )}

        <Tooltip title="Close layers panel">
          <button
            onClick={onClose}
            style={{ ...ICON_BTN, color: 'var(--color-text-muted)' }}
          >
            <X size={14} />
          </button>
        </Tooltip>
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

      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--color-border)',
          fontSize: 9,
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        Click to select · Shift-click to multi-select · Double-click to rename
      </div>
    </div>
  );
}
