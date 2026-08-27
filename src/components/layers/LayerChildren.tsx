'use client'

import React from 'react'
import { LayerRow } from './LayerRow'
import type { LayerItem, LayerCallbacks } from './layer-panel.types'

interface LayerChildrenProps extends LayerCallbacks {
  children: LayerItem[]
  depth: number
  selectedIds: Set<string>
  activeId: string | null
}

export function LayerChildren({ children, depth, selectedIds, activeId, ...callbacks }: LayerChildrenProps) {
  return (
    <>
      {children.map((child) => (
        <LayerRow
          key={child.id}
          layer={child}
          isActive={child.id === activeId}
          isSelected={selectedIds.has(child.id)}
          selectedIds={selectedIds}
          activeId={activeId}
          depth={depth}
          {...callbacks}
        />
      ))}
    </>
  )
}
