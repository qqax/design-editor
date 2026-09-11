import React from 'react';

import { ZoomIn, ZoomOut } from 'lucide-react';

import { TOOL_BTN } from '../panels/color-picker';
import { Tooltip } from '../primitives';

import type { Editor } from '../../engine';

interface ZoomProps {
  zoomPct: number;
  editor: Editor | null;
}

export const Zoom = ({ zoomPct, editor }: ZoomProps) => (
  <React.Fragment>
    <Tooltip placement="bottom" title="Zoom out">
      <button
        style={TOOL_BTN}
        type="button"
        onClick={() => {
          editor?.zoom.zoomOut();
        }}
      >
        <ZoomOut size={16} />
      </button>
    </Tooltip>
    <div
      style={{
        minWidth: 50,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--de-color-primary)',
        background:
          'color-mix(in srgb, var(--de-color-primary) 12%, transparent)',
        borderRadius: 7,
        padding: '4px 8px',
        userSelect: 'none',
        border:
          '1px solid color-mix(in srgb, var(--de-color-primary) 25%, transparent)',
      }}
    >
      {zoomPct}%
    </div>
    <Tooltip placement="bottom" title="Zoom in">
      <button
        style={TOOL_BTN}
        type="button"
        onClick={() => {
          editor?.zoom.zoomIn();
        }}
      >
        <ZoomIn size={16} />
      </button>
    </Tooltip>
  </React.Fragment>
);
