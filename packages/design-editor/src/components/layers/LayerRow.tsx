'use client';

import React, { useState } from 'react';

import { ChevronDown, ChevronRight, Shapes } from 'lucide-react';

import { TYPE_ICONS } from './layer-panel.types';
import { LayerActions } from './LayerActions';
import { LayerChildren } from './LayerChildren';
import { LayerName } from './LayerName';

import type { LayerCallbacks, LayerItem } from './layer-panel.types';

interface LayerRowProps extends LayerCallbacks {
  layer: LayerItem;
  isActive: boolean;
  isSelected: boolean;
  selectedIds: Set<string>;
  activeId: string | null;
  depth: number;
}

export function LayerRow({
  layer,
  isActive,
  isSelected,
  selectedIds,
  activeId,
  depth,
  onSelect,
  onVisibilityChange,
  onDelete,
  onDuplicate,
  onRename,
}: LayerRowProps) {
  const [hov, setHov] = useState(false);
  const [editing, setEditing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const hasChildren =
    Array.isArray(layer.children) && layer.children.length > 0;

  return (
    <React.Fragment>
      <div
        onDoubleClick={() => setEditing(true)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={(e) => {
          if (!editing) onSelect(layer.id, e.shiftKey);
        }}
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          paddingLeft: 12 + depth * 16,
          paddingRight: 8,
          cursor: 'pointer',
          background: isSelected
            ? 'color-mix(in srgb, var(--color-primary) 22%, transparent)'
            : isActive
              ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
              : hov
                ? 'color-mix(in srgb, var(--color-text) 3%, transparent)'
                : 'transparent',
          transition: 'all 0.12s',
          borderLeft: isActive
            ? '2px solid var(--color-primary)'
            : '2px solid transparent',
          boxShadow: isActive
            ? 'inset 0 0 20px color-mix(in srgb, var(--color-primary) 6%, transparent)'
            : 'none',
        }}
      >
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed((v) => !v);
            }}
            style={{
              fontSize: 10,
              color: 'var(--color-text-muted)',
              flexShrink: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </span>
        ) : (
          <span style={{ width: 10 }} />
        )}

        <span
          style={{
            fontSize: 12,
            color: isActive
              ? 'var(--color-primary)'
              : 'var(--color-text-muted)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {TYPE_ICONS[layer.type] ?? <Shapes size={14} />}
        </span>

        <LayerName
          editing={editing}
          id={layer.id}
          isActive={isActive}
          name={layer.name}
          onCancel={() => setEditing(false)}
          visible={layer.visible}
          onCommit={(id, name) => {
            onRename(id, name);
            setEditing(false);
          }}
        />

        {(hov || isActive) && !editing ? (
          <LayerActions
            id={layer.id}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onVisibilityChange={onVisibilityChange}
            visible={layer.visible}
          />
        ) : null}
      </div>

      {hasChildren && !collapsed ? (
        <LayerChildren
          activeId={activeId}
          children={layer.children!}
          depth={depth + 1}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onRename={onRename}
          onSelect={onSelect}
          onVisibilityChange={onVisibilityChange}
          selectedIds={selectedIds}
        />
      ) : null}
    </React.Fragment>
  );
}
