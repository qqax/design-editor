// ── More popover for text (spacing, leading, case) ───────────────────────
import { useCallback } from 'react';

import { Opacity } from './Opacity';
import { useMessages } from '../../../messages';
import { Segmented } from '../../primitives';

import type { Editor } from '../../../engine';
import type { TextTransform } from '../model';

interface TextMoreContentProps {
  charSpacing: number;
  lineHeight: number;
  textTransform: TextTransform;
  opacity: number;
  editor: Editor | null;
  setCharSpacing: (val: number) => void;
  setOpacity: (val: number) => void;
  setLineHeight: (val: number) => void;
  onTextTransformChange: (val: TextTransform) => void;
  multiple: boolean;
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
  onTextTransformChange,
  multiple,
}: TextMoreContentProps) => {
  const m = useMessages().text;
  const handleCharSpacingChange = useCallback(
    (val: number) => {
      const clamped = Math.max(-0.5, Math.min(2, val));
      setCharSpacing(clamped);
      editor?.objects.update({ charSpacing: Math.round(clamped * 1000) });
    },
    [editor, setCharSpacing]
  );

  const handleLineHeightChange = useCallback(
    (val: number) => {
      const clamped = Math.max(0.5, Math.min(4, val));
      setLineHeight(clamped);
      editor?.objects.update({ lineHeight: clamped });
    },
    [editor, setLineHeight]
  );

  const cases: readonly (readonly [TextTransform, string, string])[] = [
    ['none', 'Aa', m.caseNormal],
    ['upper', 'AA', m.caseUpper],
    ['lower', 'aa', m.caseLower],
    ['title', 'Tt', m.caseTitle],
  ];

  return (
    <div className="de-form" style={{ minWidth: 220 }}>
      <div className="de-popover-title">{m.typography}</div>
      <div className="de-form-field">
        <div className="de-form-row">
          <span className="de-form-label">{m.letterSpacing}</span>
          <span className="de-form-value">{charSpacing.toFixed(2)}</span>
        </div>
        <input
          aria-label={m.letterSpacing}
          className="de-range"
          max={2}
          min={-0.5}
          onChange={(e) => handleCharSpacingChange(Number(e.target.value))}
          step={0.01}
          type="range"
          value={charSpacing}
        />
      </div>
      <div className="de-form-field">
        <div className="de-form-row">
          <span className="de-form-label">{m.lineHeight}</span>
          <span className="de-form-value">{lineHeight.toFixed(1)}</span>
        </div>
        <input
          aria-label={m.lineHeight}
          className="de-range"
          max={4}
          min={0.5}
          onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          step={0.1}
          type="range"
          value={lineHeight}
        />
      </div>
      {/* Case rewrites `text`, so it is offered for a single text only */}
      {multiple ? null : (
        <div className="de-form-field">
          <span className="de-form-label">{m.case}</span>
          <Segmented
            label={m.case}
            onChange={onTextTransformChange}
            value={textTransform}
            options={cases.map(
              ([value, sample, title]) =>
                [
                  value,
                  <span key={value} title={title}>
                    {sample}
                  </span>,
                ] as const
            )}
          />
        </div>
      )}
      <Opacity editor={editor} opacity={opacity} setOpacity={setOpacity} />
    </div>
  );
};
