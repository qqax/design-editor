'use client';

import React from 'react';

import { BringToFront, Copy, SendToBack, Trash2 } from 'lucide-react';

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
  const {
    posStyle,
    label,
    isImage,
    isText,
    isShape,
    opacity,
    setOpacity,
    onDragStart,
  } = useObjectPropertiesBar({ activeObj });

  // if (!activeObj || !editor) return null;

  return (
    <div
      className="scrollbar-hide"
      style={{
        ...posStyle,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 10px',
        background: 'color-mix(in srgb, var(--color-surface) 94%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        boxShadow: '0 8px 32px var(--shadow-color)',
        whiteSpace: 'nowrap',
        overflowX: 'visible',
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={onDragStart}
        title="Drag to move"
        style={{
          cursor: 'grab',
          padding: '0 4px',
          color: 'var(--color-text-muted)',
          fontSize: 12,
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        ⠿
      </div>
      {/* Type badge */}
      <div
        style={{
          background:
            'color-mix(in srgb, var(--color-primary) 12%, transparent)',
          borderRadius: 6,
          padding: '3px 9px',
          fontSize: 10,
          fontWeight: 800,
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          flexShrink: 0,
        }}
      >
        {label}
      </div>

      <PDivider />

      {/* Opacity — compact inline (only visible for non-text/image since they have it in More) */}
      {!isText && !isImage && (
        <OpacityRange
          editor={editor}
          opacity={opacity}
          setOpacity={setOpacity}
        />
      )}

      {/* ── Image controls (compact primary row) ─────────────────────────── */}
      {isImage ? (
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
      {isText ? (
        <TextControls
          activeObj={activeObj}
          editor={editor}
          opacity={opacity}
          setOpacity={setOpacity}
        />
      ) : null}

      {/* ── Shape controls ─────────────────────────── */}
      {isShape || (!isImage && !isText) ? (
        <ShapeControls activeObj={activeObj} editor={editor} />
      ) : null}

      {/* ── Z-order + duplicate + delete — all types ── */}
      <PDivider />
      <Tooltip placement="top" title="Bring forward">
        <PBtn onClick={() => editor?.objects.bringForward()}>
          <BringToFront size={16} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Send backward">
        <PBtn onClick={() => editor?.objects.sendBackwards()}>
          <SendToBack size={16} />
        </PBtn>
      </Tooltip>
      <PDivider />
      <Tooltip placement="top" title="Duplicate">
        <PBtn onClick={async () => editor?.objects.clone()}>
          <Copy size={16} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Delete (Del)">
        <PBtn danger onClick={() => editor?.objects.remove()}>
          <Trash2 size={16} />
        </PBtn>
      </Tooltip>
    </div>
  );
}
