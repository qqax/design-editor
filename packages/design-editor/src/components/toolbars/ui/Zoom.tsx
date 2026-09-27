import React from 'react';

import { ZoomIn, ZoomOut } from 'lucide-react';

import { useMessages } from '../../../messages';
import { Tooltip } from '../../primitives';

import type { Editor } from '../../../engine';

interface ZoomProps {
  zoomPct: number;
  editor: Editor | null;
}

export const Zoom = ({ zoomPct, editor }: ZoomProps) => {
  const m = useMessages().toolbar;
  return (
    <React.Fragment>
      <Tooltip placement="bottom" title={m.zoomOut}>
        <button
          aria-label={m.zoomOut}
          className="de-tool-btn"
          onClick={() => editor?.zoom.zoomOut()}
          type="button"
        >
          <ZoomOut size={16} />
        </button>
      </Tooltip>
      <Tooltip placement="bottom" title={m.zoomToFit}>
        <button
          aria-label={m.zoomToFit}
          className="de-zoom-value"
          onClick={() => editor?.zoom.zoomToFit()}
          type="button"
        >
          {zoomPct}%
        </button>
      </Tooltip>
      <Tooltip placement="bottom" title={m.zoomIn}>
        <button
          aria-label={m.zoomIn}
          className="de-tool-btn"
          onClick={() => editor?.zoom.zoomIn()}
          type="button"
        >
          <ZoomIn size={16} />
        </button>
      </Tooltip>
    </React.Fragment>
  );
};
