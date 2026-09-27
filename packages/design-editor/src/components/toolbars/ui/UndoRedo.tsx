import React from 'react';

import { Redo, Undo } from 'lucide-react';

import { Tooltip } from '../../primitives';

import type { Editor } from '../../../engine';

interface UndoRedoProps {
  editor: Editor | null;
}

export const UndoRedo = ({ editor }: UndoRedoProps) => (
  <React.Fragment>
    <Tooltip placement="bottom" title="Undo (Ctrl+Z)">
      <button
        aria-label="Undo"
        className="de-tool-btn"
        onClick={() => editor?.history.undo()}
        type="button"
      >
        <Undo size={16} />
      </button>
    </Tooltip>
    <Tooltip placement="bottom" title="Redo (Ctrl+Y)">
      <button
        aria-label="Redo"
        className="de-tool-btn"
        onClick={() => editor?.history.redo()}
        type="button"
      >
        <Redo size={16} />
      </button>
    </Tooltip>
  </React.Fragment>
);
