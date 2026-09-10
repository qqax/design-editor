import React from 'react';

import { UnifiedColorPicker } from '../../panels/color-picker';
import { PDivider } from '../../primitives';

import type { Editor } from '../../../engine';

interface Props {
  activeObj: any;
  editor: Editor | null;
}

export const ShapeControls = ({ activeObj, editor }: Props) => {
  return (
    <React.Fragment>
      <PDivider />
      <span
        style={{
          fontSize: 11,
          color: 'var(--de-color-text-muted)',
          flexShrink: 0,
        }}
      >
        Fill
      </span>
      <UnifiedColorPicker
        activeObjId={activeObj?.id}
        color={typeof activeObj?.fill === 'string' ? activeObj.fill : '#7c3aed'}
        onChange={(c) => editor?.objects.update({ fill: c })}
        tooltip="Shape fill color"
        variant="tool-bar"
      />
      <span
        style={{
          fontSize: 11,
          color: 'var(--de-color-text-muted)',
          flexShrink: 0,
        }}
      >
        Stroke
      </span>
      <UnifiedColorPicker
        activeObjId={activeObj?.id}
        onChange={(c) => editor?.objects.update({ stroke: c })}
        tooltip="Shape stroke color"
        variant="tool-bar"
        color={
          typeof activeObj?.stroke === 'string' ? activeObj.stroke : '#ffffff'
        }
      />
      <input
        key={`${activeObj?.id}-sw`}
        defaultValue={activeObj?.strokeWidth ?? 0}
        max={40}
        min={0}
        title="Stroke width"
        type="number"
        onChange={(e) =>
          editor?.objects.update({ strokeWidth: Number(e.target.value) })
        }
        style={{
          width: 44,
          background: 'var(--de-color-bg)',
          border: '1px solid var(--de-color-border)',
          borderRadius: 6,
          color: 'var(--de-color-text)',
          fontSize: 12,
          padding: '4px 6px',
          textAlign: 'center',
          outline: 'none',
        }}
      />
    </React.Fragment>
  );
};
