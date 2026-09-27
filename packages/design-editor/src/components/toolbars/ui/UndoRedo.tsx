import React from 'react';

import { Redo, Undo } from 'lucide-react';

import { useMessages } from '../../../messages';
import { Tooltip } from '../../primitives';

import type { Editor } from '../../../engine';

interface UndoRedoProps {
  editor: Editor | null;
}

export const UndoRedo = ({ editor }: UndoRedoProps) => {
  const m = useMessages().toolbar;
  return (
    <React.Fragment>
      <Tooltip placement="bottom" title={m.undoHint}>
        <button
          aria-label={m.undo}
          className="de-tool-btn"
          onClick={() => editor?.history.undo()}
          type="button"
        >
          <Undo size={16} />
        </button>
      </Tooltip>
      <Tooltip placement="bottom" title={m.redoHint}>
        <button
          aria-label={m.redo}
          className="de-tool-btn"
          onClick={() => editor?.history.redo()}
          type="button"
        >
          <Redo size={16} />
        </button>
      </Tooltip>
    </React.Fragment>
  );
};
