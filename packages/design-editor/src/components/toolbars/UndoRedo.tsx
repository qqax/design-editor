import React from 'react';

import { Redo, Undo } from 'lucide-react';

import { TOOL_BTN } from '../panels/color-picker';
import { Tooltip } from '../primitives';

import type { Editor } from '../../engine';

interface UndoRedoProps {
  editor: Editor | null;
}

export const UndoRedo = ({ editor }: UndoRedoProps) => (
  <React.Fragment>
    <Tooltip placement="bottom" title="Undo (Ctrl+Z)">
      <button
        style={TOOL_BTN}
        type="button"
        onClick={() => {
          editor?.history.undo();
        }}
      >
        <Undo size={16} />
      </button>
    </Tooltip>
    <Tooltip placement="bottom" title="Redo (Ctrl+Y)">
      <button
        style={TOOL_BTN}
        type="button"
        onClick={() => {
          editor?.history.redo();
        }}
      >
        <Redo size={16} />
      </button>
    </Tooltip>
  </React.Fragment>
);
