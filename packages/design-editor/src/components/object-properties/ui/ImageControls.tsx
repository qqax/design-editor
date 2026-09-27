import React from 'react';

import { FlipHorizontal, FlipVertical, Scissors } from 'lucide-react';

import { ImageMoreContent } from './ImageMoreContent';
import { useMessages } from '../../../messages';
import { MoreButton, PBtn, PDivider, Popover, Tooltip } from '../../primitives';
import { useImageControls } from '../model/useImageControls';

import type { Editor } from '../../../engine';

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
  const m = useMessages().image;
  const { borderRadius, setBorderRadius, shadowEnabled, setShadowEnabled } =
    useImageControls({ activeObj });

  return (
    <React.Fragment>
      <Tooltip placement="top" title={m.flipHorizontal}>
        <PBtn
          aria-label={m.flipHorizontal}
          onClick={() => editor?.objects.update({ flipX: !activeObj?.flipX })}
        >
          <FlipHorizontal size={14} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title={m.flipVertical}>
        <PBtn
          aria-label={m.flipVertical}
          onClick={() => editor?.objects.update({ flipY: !activeObj?.flipY })}
        >
          <FlipVertical size={14} />
        </PBtn>
      </Tooltip>
      <PDivider />
      <button
        className="de-btn"
        data-size="sm"
        data-variant="secondary"
        disabled={removingBg}
        onClick={onRemoveBg}
        title={m.removeBackgroundHint}
        type="button"
      >
        <Scissors size={13} />
        {removingBg ? m.removing : m.removeBackground}
      </button>
      <PDivider />
      {/* Image More options */}
      <Popover
        placement="top"
        content={
          <ImageMoreContent
            borderRadius={borderRadius}
            editor={editor}
            opacity={opacity}
            setBorderRadius={setBorderRadius}
            setOpacity={setOpacity}
            setShadowEnabled={setShadowEnabled}
            shadowEnabled={shadowEnabled}
          />
        }
      >
        <MoreButton label={m.more} />
      </Popover>
    </React.Fragment>
  );
};
