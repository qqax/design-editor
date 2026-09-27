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
        className="de-layer-row"
        data-active={isActive}
        data-hidden={!layer.visible}
        data-selected={isSelected}
        onDoubleClick={() => setEditing(true)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ paddingLeft: 10 + depth * 14 }}
        onClick={(e) => {
          if (!editing) onSelect(layer.id, e.shiftKey);
        }}
      >
        {hasChildren ? (
          <span
            className="de-layer-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed((v) => !v);
            }}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </span>
        ) : (
          <span className="de-layer-toggle" />
        )}

        <span className="de-layer-icon">
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

      {layer.children && hasChildren && !collapsed ? (
        <LayerChildren
          activeId={activeId}
          depth={depth + 1}
          items={layer.children}
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
