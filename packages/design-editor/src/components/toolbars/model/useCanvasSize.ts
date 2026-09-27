'use client';

import { useCallback, useState } from 'react';

import { defaultFrameOptions, useFrame } from '../../../engine';

import type { Editor } from '../../../engine';
import type { EditorMessages } from '../../../messages';

/** Built-in size presets; values are `WIDTHxHEIGHT` in pixels */
export const defaultCanvasSizes = (m: EditorMessages['canvasSize']) => [
  { label: m.landscape, value: '1920x1080' },
  { label: m.square, value: '1080x1080' },
  { label: m.portrait, value: '1080x1920' },
  { label: m.leaderboard, value: '728x90' },
  { label: m.mediumRectangle, value: '300x250' },
  { label: m.a4, value: '2480x3508' },
  { label: m.a5, value: '1748x2480' },
  { label: m.letter, value: '2550x3300' },
  { label: m.businessCard, value: '1004x650' },
  { label: m.custom, value: 'custom' },
];

export function useCanvasSize(editor: Editor | null) {
  const [customOpen, setCustomOpen] = useState(false);

  const [customW, setCustomW] = useState<number | null>(null);
  const [customH, setCustomH] = useState<number | null>(null);

  const frame = useFrame() as { width?: number; height?: number } | null;
  const frameWidth = frame?.width
    ? Math.round(frame.width)
    : defaultFrameOptions.width;
  const frameHeight = frame?.height
    ? Math.round(frame.height)
    : defaultFrameOptions.height;

  const size = `${frameWidth}x${frameHeight}`;

  const currentW = customOpen ? (customW ?? frameWidth) : frameWidth;
  const currentH = customOpen ? (customH ?? frameHeight) : frameHeight;

  const applySize = useCallback(
    (w: number, h: number) => {
      if (!editor) return;
      editor.frame.resize({ width: w, height: h });
      editor.zoom.zoomToFit();
    },
    [editor]
  );

  const handleSizeChange = useCallback(
    (value: string) => {
      if (value === 'custom') {
        setCustomW(frameWidth);
        setCustomH(frameHeight);
        setCustomOpen(true);
        return;
      }
      setCustomOpen(false);
      const [w, h] = value.split('x').map(Number);
      applySize(w, h);
    },
    [applySize, frameWidth, frameHeight]
  );

  const handleApplyCustom = useCallback(() => {
    const w = Math.max(100, Math.min(8000, customW ?? frameWidth));
    const h = Math.max(100, Math.min(8000, customH ?? frameHeight));
    setCustomOpen(false);
    applySize(w, h);
  }, [customW, customH, frameWidth, frameHeight, applySize]);

  return {
    size,
    customOpen,
    setCustomOpen,
    customW: currentW,
    setCustomW,
    customH: currentH,
    setCustomH,
    handleSizeChange,
    handleApplyCustom,
  };
}
