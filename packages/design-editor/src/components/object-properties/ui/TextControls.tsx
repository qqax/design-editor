import React from 'react';

import { AlignCenter, AlignLeft, AlignRight, Bold, Italic } from 'lucide-react';

import { FontPickerPopover } from './FontPickerPopover';
import { TextMoreContent } from './TextMoreContent';
import { useMessages } from '../../../messages';
import { UnifiedColorPicker } from '../../panels';
import { MoreButton, PBtn, PDivider, Popover, Tooltip } from '../../primitives';
import { useTextControls } from '../model';

import type { Editor } from '../../../engine';

interface TextControlsProps {
  editor: Editor | null;
  activeObj: any;
  multiple?: boolean;
  opacity: number;
  setOpacity: (o: number) => void;
}

export const TextControls = ({
  editor,
  activeObj,
  multiple = false,
  opacity,
  setOpacity,
}: TextControlsProps) => {
  const m = useMessages().text;
  const {
    isEditingText,
    selStyle,
    fontFamily,
    charSpacing,
    setCharSpacing,
    lineHeight,
    setLineHeight,
    textTransform,
    applyTextTransform,
    handleFontChange,
  } = useTextControls({ editor, activeObj });

  return (
    <React.Fragment>
      {/* Font — show selection style font if editing */}
      <FontPickerPopover
        onChange={handleFontChange}
        currentFamily={
          isEditingText && selStyle.fontFamily
            ? selStyle.fontFamily
            : fontFamily
        }
      />
      <PDivider />
      <input
        key={`${activeObj?.id}-fs`}
        aria-label={m.fontSize}
        className="de-num-input"
        max={500}
        min={6}
        style={{ width: 48, textAlign: 'center' }}
        title={m.fontSize}
        type="number"
        onChange={(e) =>
          editor?.objects.update({ fontSize: Number(e.target.value) })
        }
        value={
          isEditingText && selStyle.fontSize != null
            ? selStyle.fontSize
            : (activeObj?.fontSize ?? 32)
        }
      />
      <PDivider />
      {/* Text Color — reflects selection color when editing */}
      <UnifiedColorPicker
        activeObjId={activeObj?.id}
        onChange={(c) => editor?.objects.update({ fill: c })}
        tooltip={m.color}
        variant="property-bar"
        color={
          isEditingText && typeof selStyle.fill === 'string'
            ? selStyle.fill
            : typeof activeObj?.fill === 'string'
              ? activeObj.fill
              : '#000000'
        }
      />
      <PDivider />
      <Tooltip placement="top" title={m.bold}>
        <PBtn
          aria-label={m.bold}
          active={
            (isEditingText ? selStyle.fontWeight : activeObj?.fontWeight) ===
            'bold'
          }
          onClick={() =>
            editor?.objects.update({
              fontWeight:
                (isEditingText
                  ? selStyle.fontWeight
                  : activeObj?.fontWeight) === 'bold'
                  ? 'normal'
                  : 'bold',
            })
          }
        >
          <Bold size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title={m.italic}>
        <PBtn
          active={activeObj?.fontStyle === 'italic'}
          aria-label={m.italic}
          onClick={() =>
            editor?.objects.update({
              fontStyle:
                activeObj?.fontStyle === 'italic' ? 'normal' : 'italic',
            })
          }
        >
          <Italic size={14} />
        </PBtn>
      </Tooltip>
      <PDivider />
      <Tooltip placement="top" title={m.alignLeft}>
        <PBtn
          active={activeObj?.textAlign === 'left'}
          aria-label={m.alignLeft}
          onClick={() => editor?.objects.update({ textAlign: 'left' })}
        >
          <AlignLeft size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title={m.alignCenter}>
        <PBtn
          active={activeObj?.textAlign === 'center'}
          aria-label={m.alignCenter}
          onClick={() => editor?.objects.update({ textAlign: 'center' })}
        >
          <AlignCenter size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title={m.alignRight}>
        <PBtn
          active={activeObj?.textAlign === 'right'}
          aria-label={m.alignRight}
          onClick={() => editor?.objects.update({ textAlign: 'right' })}
        >
          <AlignRight size={14} />
        </PBtn>
      </Tooltip>
      <PDivider />
      {/* More text options */}
      <Popover
        placement="top"
        content={
          <TextMoreContent
            charSpacing={charSpacing}
            editor={editor}
            lineHeight={lineHeight}
            multiple={multiple}
            onTextTransformChange={applyTextTransform}
            opacity={opacity}
            setCharSpacing={setCharSpacing}
            setLineHeight={setLineHeight}
            setOpacity={setOpacity}
            textTransform={textTransform}
          />
        }
      >
        <MoreButton label={m.more} />
      </Popover>
    </React.Fragment>
  );
};
