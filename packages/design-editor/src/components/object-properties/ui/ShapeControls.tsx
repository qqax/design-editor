import { PDivider } from '../../primitives';
import { PropertyColorPicker } from './PropertyColorPicker';
import React from 'react';
import { Editor } from '../../../engine';

interface Props {
  activeObj: any;
  editor: Editor | null;
}

export const ShapeControls = ({
                                activeObj, editor,
                              }: Props) => {
  return (
    <React.Fragment>
      <PDivider />
      <span
        style={{
          fontSize: 11,
          color: 'var(--color-text-muted)',
          flexShrink: 0,
        }}
      >
            Fill
          </span>
      <PropertyColorPicker
        activeObjId={activeObj?.id}
        onChange={(c) => editor?.objects.update({ fill: c })}
        tooltip="Shape fill color"
        color={
          typeof activeObj?.fill === 'string' ? activeObj.fill : '#7c3aed'
        }
      />
      <span
        style={{
          fontSize: 11,
          color: 'var(--color-text-muted)',
          flexShrink: 0,
        }}
      >
            Stroke
          </span>
      <PropertyColorPicker
        activeObjId={activeObj?.id}
        onChange={(c) => editor?.objects.update({ stroke: c })}
        tooltip="Shape stroke color"
        color={
          typeof activeObj?.stroke === 'string' && activeObj.stroke
            ? activeObj.stroke
            : '#ffffff'
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
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          color: 'var(--color-text)',
          fontSize: 12,
          padding: '4px 6px',
          textAlign: 'center',
          outline: 'none',
        }}
      />
    </React.Fragment>
  );
};