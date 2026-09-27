'use client';

import React from 'react';

import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react';

import { useMessages } from '../../messages';
import { Tooltip } from '../primitives';

interface LayerActionsProps {
  id: string;
  visible: boolean;
  onVisibilityChange: (id: string, visible: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function LayerActions({
  id,
  visible,
  onVisibilityChange,
  onDuplicate,
  onDelete,
}: LayerActionsProps) {
  const m = useMessages().layers;
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
      <Tooltip title={visible ? m.hide : m.show}>
        <button
          aria-label={visible ? m.hide : m.show}
          className="de-icon-btn de-icon-btn-sm"
          type="button"
          onClick={(e) => {
            stop(e);
            onVisibilityChange(id, !visible);
          }}
        >
          {visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
      </Tooltip>

      <Tooltip title={m.duplicate}>
        <button
          aria-label={m.duplicate}
          className="de-icon-btn de-icon-btn-sm"
          type="button"
          onClick={(e) => {
            stop(e);
            onDuplicate(id);
          }}
        >
          <Copy size={12} />
        </button>
      </Tooltip>

      <Tooltip title={m.delete}>
        <button
          data-danger
          aria-label={m.delete}
          className="de-icon-btn de-icon-btn-sm"
          type="button"
          onClick={(e) => {
            stop(e);
            onDelete(id);
          }}
        >
          <Trash2 size={12} />
        </button>
      </Tooltip>
    </div>
  );
}
