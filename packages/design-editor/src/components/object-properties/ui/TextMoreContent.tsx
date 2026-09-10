// ── More popover for text (spacing, leading, case) ───────────────────────
import React, { useCallback } from 'react';
import { Editor } from '../../../engine';
import { TextTransform } from '../model';
import { Opacity } from './Opacity';

interface TextMoreContentProps {
  charSpacing: number;
  lineHeight: number;
  textTransform: TextTransform;
  opacity: number;
  editor: Editor | null;
  setCharSpacing: (val: number) => void;
  setOpacity: (val: number) => void;
  setLineHeight: (val: number) => void;
  setTextTransform: (val: TextTransform) => void;
  activeObj: any;
  originalTextRef: React.MutableRefObject<string | undefined>;
}

export const TextMoreContent = ({
  charSpacing,
  lineHeight,
  textTransform,
  opacity,
  editor,
  setCharSpacing,
  setOpacity,
  setLineHeight,
  setTextTransform,
  activeObj,
  originalTextRef
}: TextMoreContentProps) => {
  const handleCharSpacingChange = useCallback(
    (val: number) => {
      const clamped = Math.max(-0.5, Math.min(2, val));
      setCharSpacing(clamped);
      editor?.objects.update({ charSpacing: Math.round(clamped * 1000) });
    },
    [editor]
  );

  const handleLineHeightChange = useCallback(
    (val: number) => {
      const clamped = Math.max(0.5, Math.min(4, val));
      setLineHeight(clamped);
      editor?.objects.update({ lineHeight: clamped });
    },
    [editor]
  );

  const handleTextTransformChange = useCallback(
    (transform: TextTransform) => {
      const currentText = (activeObj?.text as string | undefined) ?? '';
      if (transform !== 'none' && originalTextRef.current === undefined) {
        originalTextRef.current = currentText;
      }
      const base = originalTextRef.current ?? currentText;
      let transformed: string;
      switch (transform) {
        case 'upper':
          transformed = base.toUpperCase();
          break;
        case 'lower':
          transformed = base.toLowerCase();
          break;
        case 'title':
          transformed = base.replace(
            /\w\S*/g,
            (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          );
          break;
        case 'none':
        default:
          transformed = base;
          originalTextRef.current = undefined;
          break;
      }
      setTextTransform(transform);
      editor?.objects.update({ text: transformed });
    },
    [editor, activeObj]
  );

  return(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '14px 16px',
        minWidth: 220,
        background: 'var(--de-color-surface)',
        border: '1px solid var(--de-color-border)',
        borderRadius: 12,
        boxShadow: '0 8px 32px var(--shadow-color)',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 11,
          color: 'var(--de-color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Typography
      </div>
      {/* Letter Spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--de-color-text-muted)' }}>
            Letter Spacing
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--de-color-text)',
              minWidth: 36,
              textAlign: 'right',
            }}
          >
            {charSpacing.toFixed(2)}
          </span>
        </div>
        <input
          max={2}
          min={-0.5}
          onChange={(e) => handleCharSpacingChange(Number(e.target.value))}
          step={0.01}
          type="range"
          value={charSpacing}
          style={{
            width: '100%',
            accentColor: 'var(--de-color-primary)',
            cursor: 'pointer',
          }}
        />
      </div>
      {/* Line Height */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--de-color-text-muted)' }}>
            Line Height
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--de-color-text)',
              minWidth: 36,
              textAlign: 'right',
            }}
          >
            {lineHeight.toFixed(1)}
          </span>
        </div>
        <input
          max={4}
          min={0.5}
          onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          step={0.1}
          type="range"
          value={lineHeight}
          style={{
            width: '100%',
            accentColor: 'var(--de-color-primary)',
            cursor: 'pointer',
          }}
        />
      </div>
      {/* Text Transform / Case */}
      <div>
        <span
          style={{
            fontSize: 12,
            color: 'var(--de-color-text-muted)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Case
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {(
            [
              { value: 'none', label: 'Aa', title: 'Normal' },
              { value: 'upper', label: 'AA', title: 'Uppercase' },
              { value: 'lower', label: 'aa', title: 'Lowercase' },
              { value: 'title', label: 'Tt', title: 'Title Case' },
            ] as { value: TextTransform; label: string; title: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTextTransformChange(opt.value)}
              title={opt.title}
              style={{
                flex: 1,
                height: 30,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                background:
                  textTransform === opt.value
                    ? 'color-mix(in srgb, var(--de-color-primary) 15%, transparent)'
                    : 'color-mix(in srgb, var(--de-color-text) 5%, transparent)',
                border:
                  textTransform === opt.value
                    ? '1.5px solid var(--de-color-primary)'
                    : '1px solid var(--de-color-border)',
                color:
                  textTransform === opt.value
                    ? 'var(--de-color-primary)'
                    : 'var(--de-color-text-muted)',
                borderRadius: 6,
                outline: 'none',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* Opacity (also available here for convenience) */}
      <Opacity opacity={opacity} setOpacity={setOpacity} editor={editor} />
    </div>
  );
}