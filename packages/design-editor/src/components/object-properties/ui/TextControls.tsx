import React from 'react';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  MoreHorizontal,
} from 'lucide-react';

import { FontPickerPopover } from './FontPickerPopover';
import { TextMoreContent } from './TextMoreContent';
import { createDefaultFontProvider } from '../../../providers';
import { UnifiedColorPicker } from '../../panels/color-picker';
import { PBtn, PDivider, Popover, Tooltip } from '../../primitives';
import { useTextControls } from '../model';

import type { Editor } from '../../../engine';

interface TextControlsProps {
  editor: Editor | null;
  activeObj: any;
  opacity: number;
  setOpacity: (o: number) => void;
}

const DEFAULT_FONT_PROVIDER = createDefaultFontProvider();

export const TextControls = ({
  editor,
  activeObj,
  opacity,
  setOpacity,
}: TextControlsProps) => {
  const {
    isEditingText,
    selStyle,
    fontFamily,
    charSpacing,
    setCharSpacing,
    lineHeight,
    textTransform,
    setTextTransform,
    handleFontChange,
    originalTextRef,
  } = useTextControls({ editor, activeObj });

  return (
    <React.Fragment>
      {/* Font — show selection style font if editing */}
      <FontPickerPopover
        fontProvider={DEFAULT_FONT_PROVIDER}
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
        max={500}
        min={6}
        title="Font size"
        type="number"
        onChange={(e) =>
          editor?.objects.update({ fontSize: Number(e.target.value) })
        }
        style={{
          width: 46,
          background: 'var(--de-color-bg)',
          border: '1px solid var(--de-color-border)',
          borderRadius: 6,
          color: 'var(--de-color-text)',
          fontSize: 12,
          padding: '4px 4px',
          textAlign: 'center',
          outline: 'none',
        }}
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
        tooltip="Text color"
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
      <Tooltip placement="top" title="Bold">
        <PBtn
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
            } as any)
          }
        >
          <Bold size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Italic">
        <PBtn
          active={activeObj?.fontStyle === 'italic'}
          onClick={() =>
            editor?.objects.update({
              fontStyle:
                activeObj?.fontStyle === 'italic' ? 'normal' : 'italic',
            } as any)
          }
        >
          <Italic size={14} />
        </PBtn>
      </Tooltip>
      <PDivider />
      <Tooltip placement="top" title="Align left">
        <PBtn
          active={activeObj?.textAlign === 'left'}
          onClick={() => editor?.objects.update({ textAlign: 'left' })}
        >
          <AlignLeft size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Align center">
        <PBtn
          active={activeObj?.textAlign === 'center'}
          onClick={() => editor?.objects.update({ textAlign: 'center' })}
        >
          <AlignCenter size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Align right">
        <PBtn
          active={activeObj?.textAlign === 'right'}
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
            activeObj={activeObj}
            charSpacing={charSpacing}
            editor={editor}
            lineHeight={lineHeight}
            opacity={opacity}
            originalTextRef={originalTextRef}
            setCharSpacing={setCharSpacing}
            setLineHeight={setOpacity}
            setOpacity={setOpacity}
            setTextTransform={setTextTransform}
            textTransform={textTransform}
          />
        }
      >
        <button
          title="More text options"
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 7,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            background:
              'color-mix(in srgb, var(--de-color-text) 5%, transparent)',
            border: '1px solid var(--de-color-border)',
            color: 'var(--de-color-text-muted)',
            outline: 'none',
            transition: 'all 0.15s',
          }}
        >
          <MoreHorizontal size={14} />
          <span style={{ fontSize: 10 }}>More</span>
        </button>
      </Popover>
    </React.Fragment>
  );
};
