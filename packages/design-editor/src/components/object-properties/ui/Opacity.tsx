import React from 'react';
import { Editor } from '../../../engine';

interface Props {
  opacity: number;
  setOpacity: (opacity: number) => void;
  editor: Editor | null;
}

export const Opacity = ({ opacity, setOpacity, editor }: Props) => (
  <div
    style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              Opacity
            </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-text)',
            minWidth: 36,
            textAlign: 'right',
          }}
        >
              {opacity}%
            </span>
      </div>
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
          width: '100%',
          accentColor: 'var(--color-primary)',
          cursor: 'pointer',
        }}
      />
    </div>
  </div>
);
