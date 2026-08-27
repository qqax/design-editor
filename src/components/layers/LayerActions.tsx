'use client'

import React from 'react'
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react'
import { Tooltip } from '../primitives'
import { ICON_BTN } from './layer-panel.types'

interface LayerActionsProps {
  id: string
  visible: boolean
  onVisibilityChange: (id: string, visible: boolean) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function LayerActions({ id, visible, onVisibilityChange, onDuplicate, onDelete }: LayerActionsProps) {
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
      <Tooltip title={visible ? 'Hide' : 'Show'}>
        <button onClick={(e) => { stop(e); onVisibilityChange(id, !visible) }} style={ICON_BTN}>
          {visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
      </Tooltip>

      <Tooltip title="Duplicate">
        <button onClick={(e) => { stop(e); onDuplicate(id) }} style={ICON_BTN}>
          <Copy size={12} />
        </button>
      </Tooltip>

      <Tooltip title="Delete">
        <button
          onClick={(e) => { stop(e); onDelete(id) }}
          style={{ ...ICON_BTN, color: 'var(--color-danger)' }}
        >
          <Trash2 size={12} />
        </button>
      </Tooltip>
    </div>
  )
}
