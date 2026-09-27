'use client';

import React from 'react';

import { BringToFront, Copy, SendToBack, Trash2 } from 'lucide-react';

import { useMessages } from '../../../messages';
import { PBtn, PDivider, Tooltip } from '../../primitives';
import { useObjectPropertiesBar } from '../model';
import { ImageControls } from './ImageControls';
import { OpacityRange } from './OpacityRange';
import { ShapeControls } from './ShapeControls';
import { TextControls } from './TextControls';

import type { Editor } from '../../../engine';

interface Props {
  activeObj: any;
  editor: Editor | null;
  removingBg: boolean;
  onRemoveBg: () => void;
}

export function ObjectPropertiesBar({
  activeObj,
  editor,
  removingBg,
  onRemoveBg,
}: Props) {
  const m = useMessages().properties;
  const {
    posStyle,
    kind,
    target,
    multiple,
    label,
    opacity,
    setOpacity,
    onDragStart,
  } = useObjectPropertiesBar({ activeObj });

  if (!activeObj || !editor || !kind) return null;

  return (
    <div
      className="de-props-bar scrollbar-hide"
      style={{ ...posStyle, zIndex: 30 }}
    >
      <div className="de-props-grip" onMouseDown={onDragStart} title={m.drag}>
        ⠿
      </div>
      <div className="de-props-badge">{label}</div>

      <PDivider />

      {/* Opacity — compact inline (only visible for non-text/image since they have it in More) */}
      {kind !== 'text' && kind !== 'image' && (
        <OpacityRange
          editor={editor}
          opacity={opacity}
          setOpacity={setOpacity}
        />
      )}

      {/* ── Image controls (compact primary row) ─────────────────────────── */}
      {kind === 'image' ? (
        <ImageControls
          activeObj={activeObj}
          editor={editor}
          onRemoveBg={onRemoveBg}
          opacity={opacity}
          removingBg={removingBg}
          setOpacity={setOpacity}
        />
      ) : null}

      {/* ── Text controls (compact primary row) ────────────────────────────── */}
      {kind === 'text' ? (
        <TextControls
          activeObj={target}
          editor={editor}
          multiple={multiple}
          opacity={opacity}
          setOpacity={setOpacity}
        />
      ) : null}

      {/* ── Shape controls ─────────────────────────── */}
      {kind === 'shape' ? (
        <ShapeControls activeObj={activeObj} editor={editor} />
      ) : null}

      {/* ── Z-order + duplicate + delete — all types ── */}
      <PDivider />
      <Tooltip placement="top" title={m.bringForward}>
        <PBtn
          aria-label={m.bringForward}
          onClick={() => editor?.objects.bringForward()}
        >
          <BringToFront size={16} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title={m.sendBackward}>
        <PBtn
          aria-label={m.sendBackward}
          onClick={() => editor?.objects.sendBackwards()}
        >
          <SendToBack size={16} />
        </PBtn>
      </Tooltip>
      <PDivider />
      <Tooltip placement="top" title={m.duplicate}>
        <PBtn
          aria-label={m.duplicate}
          onClick={async () => editor?.objects.clone()}
        >
          <Copy size={16} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title={m.delete}>
        <PBtn
          danger
          aria-label={m.delete}
          onClick={() => editor?.objects.remove()}
        >
          <Trash2 size={16} />
        </PBtn>
      </Tooltip>
    </div>
  );
}
