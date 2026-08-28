'use client';

import React from 'react';

import { LayerRow } from './LayerRow';

import type { LayerCallbacks, LayerItem } from './layer-panel.types';

interface LayerChildrenProps extends LayerCallbacks {
  children: LayerItem[];
  depth: number;
  selectedIds: Set<string>;
  activeId: string | null;
}

export function LayerChildren({
  children,
  depth,
  selectedIds,
  activeId,
  ...callbacks
}: LayerChildrenProps) {
  return (
    <React.Fragment>
      {children.map((child) => (
        <LayerRow
          key={child.id}
          activeId={activeId}
          depth={depth}
          isActive={child.id === activeId}
          isSelected={selectedIds.has(child.id)}
          layer={child}
          selectedIds={selectedIds}
          {...callbacks}
        />
      ))}
    </React.Fragment>
  );
}
