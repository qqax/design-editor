import React from 'react';

import { useMessages } from '../../../messages';
import { UnifiedColorPicker } from '../../panels/color-picker';
import { PDivider } from '../../primitives';

import type { FabricObject } from 'fabric';

import type { Editor } from '../../../engine';

interface Props {
  activeObj: FabricObject | null;
  editor: Editor | null;
}

export const ShapeControls = ({ activeObj, editor }: Props) => {
  const m = useMessages().shape;
  return (
    <React.Fragment>
      <PDivider />
      <span className="de-props-label">{m.fill}</span>
      <UnifiedColorPicker
        activeObjId={activeObj?.id}
        color={typeof activeObj?.fill === 'string' ? activeObj.fill : '#7c3aed'}
        label={m.fill}
        onChange={(c) => editor?.objects.update({ fill: c })}
        tooltip={m.fillHint}
        variant="property-bar"
      />
      <span className="de-props-label">{m.stroke}</span>
      <UnifiedColorPicker
        activeObjId={activeObj?.id}
        label={m.stroke}
        onChange={(c) => editor?.objects.update({ stroke: c })}
        tooltip={m.strokeHint}
        variant="property-bar"
        color={
          typeof activeObj?.stroke === 'string' ? activeObj.stroke : '#ffffff'
        }
      />
      <input
        key={`${activeObj?.id}-sw`}
        aria-label={m.strokeWidth}
        className="de-num-input"
        defaultValue={activeObj?.strokeWidth ?? 0}
        max={40}
        min={0}
        style={{ textAlign: 'center' }}
        title={m.strokeWidth}
        type="number"
        onChange={(e) =>
          editor?.objects.update({ strokeWidth: Number(e.target.value) })
        }
      />
    </React.Fragment>
  );
};
