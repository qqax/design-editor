'use client';

import React from 'react';

import { LayerRow } from './LayerRow';

import type { LayerCallbacks, LayerItem } from './layer-panel.types';

interface LayerListProps extends LayerCallbacks {
  layers: LayerItem[];
  activeId: string | null;
  selectedIds: Set<string>;
}

export function LayerList({
  layers,
  activeId,
  selectedIds,
  ...callbacks
}: LayerListProps) {
  if (layers.length === 0) {
    return (
      <div className="de-panel-empty">
        No layers yet.
        <br />
        Add content to the canvas.
      </div>
    );
  }

  return (
    <React.Fragment>
      {layers.map((layer) => (
        <LayerRow
          key={layer.id}
          activeId={activeId}
          depth={0}
          isActive={layer.id === activeId}
          isSelected={selectedIds.has(layer.id)}
          layer={layer}
          selectedIds={selectedIds}
          {...callbacks}
        />
      ))}
    </React.Fragment>
  );
}
