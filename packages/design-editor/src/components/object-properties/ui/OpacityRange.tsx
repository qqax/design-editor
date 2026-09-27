import React from 'react';

import { useMessages } from '../../../messages';

import type { Editor } from '../../../engine';

interface Props {
  opacity: number;
  setOpacity: (opacity: number) => void;
  editor: Editor | null;
}

/** Compact opacity slider for the properties bar */
export const OpacityRange = ({ opacity, setOpacity, editor }: Props) => {
  const m = useMessages().properties;
  return (
    <React.Fragment>
      <span className="de-props-label">{m.opacity}</span>
      <input
        aria-label={m.opacity}
        className="de-range"
        max={100}
        min={0}
        style={{ flex: '0 0 72px' }}
        type="range"
        value={opacity}
        onChange={(e) => {
          const v = Number(e.target.value);
          setOpacity(v);
          editor?.objects.update({ opacity: v / 100 });
        }}
      />
      <span className="de-form-value" style={{ minWidth: 30 }}>
        {opacity}%
      </span>
    </React.Fragment>
  );
};
