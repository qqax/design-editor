import React from 'react';

import { useMessages } from '../../../messages';

import type { Editor } from '../../../engine';

interface Props {
  opacity: number;
  setOpacity: (opacity: number) => void;
  editor: Editor | null;
}

/** Opacity section of the "More" popovers */
export const Opacity = ({ opacity, setOpacity, editor }: Props) => {
  const m = useMessages().properties;
  return (
    <div className="de-form-section">
      <div className="de-form-row">
        <span className="de-form-label">{m.opacity}</span>
        <span className="de-form-value">{opacity}%</span>
      </div>
      <input
        aria-label={m.opacity}
        className="de-range"
        max={100}
        min={0}
        type="range"
        value={opacity}
        onChange={(e) => {
          const v = Number(e.target.value);
          setOpacity(v);
          editor?.objects.update({ opacity: v / 100 });
        }}
      />
    </div>
  );
};
