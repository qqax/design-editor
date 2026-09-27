import React from 'react';

import { ZoomIn, ZoomOut } from 'lucide-react';

import { Tooltip } from '../../primitives';

import type { Editor } from '../../../engine';

interface ZoomProps {
  zoomPct: number;
  editor: Editor | null;
}

export const Zoom = ({ zoomPct, editor }: ZoomProps) => (
  <React.Fragment>
    <Tooltip placement="bottom" title="Zoom out">
      <button
        aria-label="Zoom out"
        className="de-tool-btn"
        onClick={() => editor?.zoom.zoomOut()}
        type="button"
      >
        <ZoomOut size={16} />
      </button>
    </Tooltip>
    <Tooltip placement="bottom" title="Fit to screen (Ctrl+0)">
      <button
        className="de-zoom-value"
        onClick={() => editor?.zoom.zoomToFit()}
        type="button"
      >
        {zoomPct}%
      </button>
    </Tooltip>
    <Tooltip placement="bottom" title="Zoom in">
      <button
        aria-label="Zoom in"
        className="de-tool-btn"
        onClick={() => editor?.zoom.zoomIn()}
        type="button"
      >
        <ZoomIn size={16} />
      </button>
    </Tooltip>
  </React.Fragment>
);
