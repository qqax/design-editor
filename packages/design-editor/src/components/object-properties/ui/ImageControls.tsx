import { PBtn, PDivider, Popover, Tooltip } from '../../primitives';
import { FlipHorizontal, FlipVertical, MoreHorizontal, Scissors } from 'lucide-react';
import { ImageMoreContent } from './ImageMoreContent';
import React from 'react';
import { Editor } from '../../../engine';
import { useImageControls } from '../model/useImageControls';

interface Props {
  editor: Editor | null;
  opacity: number;
  setOpacity: (opacity: number) => void;
  removingBg: boolean;
  onRemoveBg: () => void;
  activeObj: any;
}

export const ImageControls = ({
                                editor,
                                opacity,
                                setOpacity,
                                removingBg,
                                onRemoveBg,
                                activeObj,
                              }: Props) => {
  const {
    borderRadius,
    setBorderRadius,
    shadowEnabled,
    setShadowEnabled,
  } = useImageControls({ activeObj });

  return (
    <React.Fragment>
      <Tooltip placement="top" title="Flip horizontal">
        <PBtn
          onClick={() =>
            editor?.objects.update({ flipX: !activeObj?.flipX })
          }
        >
          <FlipHorizontal size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Flip vertical">
        <PBtn
          onClick={() =>
            editor?.objects.update({ flipY: !activeObj?.flipY })
          }
        >
          <FlipVertical size={14} />
        </PBtn>
      </Tooltip>
      <PDivider />
      <button
        onClick={onRemoveBg}
        title="Remove image background"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 10px',
          borderRadius: 7,
          cursor: removingBg ? 'wait' : 'pointer',
          fontSize: 11,
          fontWeight: 600,
          background: removingBg
            ? 'color-mix(in srgb, var(--color-text) 5%, transparent)'
            : 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
          border: `1px solid ${removingBg ? 'var(--color-border)' : 'var(--color-primary)'}`,
          color: removingBg
            ? 'var(--color-text-muted)'
            : 'var(--color-primary)',
          outline: 'none',
          transition: 'all 0.15s',
        }}
      >
        <Scissors size={13} />
        {removingBg ? 'Removing…' : 'Remove BG'}
      </button>
      <PDivider />
      {/* Image More options */}
      <Popover
        content={<ImageMoreContent editor={editor} borderRadius={borderRadius} setBorderRadius={setBorderRadius}
                                   opacity={opacity} setOpacity={setOpacity} shadowEnabled={shadowEnabled}
                                   setShadowEnabled={setShadowEnabled} />} placement="top">
        <button
          title="More image options"
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
              'color-mix(in srgb, var(--color-text) 5%, transparent)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
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