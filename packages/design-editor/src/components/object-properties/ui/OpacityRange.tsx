import React from 'react';

import type { Editor } from '../../../engine';

interface Props {
  opacity: number;
  setOpacity: (opacity: number) => void;
  editor: Editor | null;
}

export const OpacityRange = ({ opacity, setOpacity, editor }: Props) => (
  <React.Fragment>
    <span
      style={{
        fontSize: 11,
        color: 'var(--de-color-text-muted)',
        flexShrink: 0,
      }}
    >
      Opacity
    </span>
    <input
      max={100}
      min={0}
      type="range"
      value={opacity}
      onChange={(e) => {
        const v = Number(e.target.value);
        setOpacity(v);
        editor?.objects.update({ opacity: v / 100 });
      }}
      style={{
        width: 72,
        accentColor: 'var(--de-color-primary)',
        cursor: 'pointer',
      }}
    />
    <span
      style={{
        fontSize: 11,
        color: 'var(--de-color-text)',
        minWidth: 28,
        textAlign: 'right',
      }}
    >
      {opacity}%
    </span>
  </React.Fragment>
);
