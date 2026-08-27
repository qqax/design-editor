'use client'

import React from 'react'
import { LayerRow } from './LayerRow'
import type { LayerItem, LayerCallbacks } from './layer-panel.types'

interface LayerListProps extends LayerCallbacks {
  layers: LayerItem[]
  activeId: string | null
  selectedIds: Set<string>
}

export function LayerList({ layers, activeId, selectedIds, ...callbacks }: LayerListProps) {
  if (layers.length === 0) {
    return (
      <div
        style={{
          padding: '32px 16px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 12,
        }}
      >
        No layers yet.
        <br />
        Add content to the canvas.
      </div>
    )
  }

  return (
    <>
      {layers.map((layer) => (
        <LayerRow
          key={layer.id}
          layer={layer}
          isActive={layer.id === activeId}
          isSelected={selectedIds.has(layer.id)}
          selectedIds={selectedIds}
          activeId={activeId}
          depth={0}
          {...callbacks}
        />
      ))}
    </>
  )
}
