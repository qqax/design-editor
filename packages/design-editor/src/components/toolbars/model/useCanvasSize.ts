'use client';

import { useCallback, useState } from 'react';

import { defaultFrameOptions, useFrame } from '../../../engine';

import type { Editor } from '../../../engine';
import type { EditorMessages } from '../../../messages';

/**
 * Built-in size presets. Values are `WIDTHxHEIGHT` in pixels; print sizes add
 * `@DPI`, which becomes the document resolution when picked.
 */
export const defaultCanvasSizes = (m: EditorMessages['canvasSize']) => [
  { label: m.landscape, value: '1920x1080' },
  { label: m.square, value: '1080x1080' },
  { label: m.portrait, value: '1080x1920' },
  { label: m.leaderboard, value: '728x90' },
  { label: m.mediumRectangle, value: '300x250' },
  { label: m.a4, value: '2480x3508@300' },
  { label: m.a5, value: '1748x2480@300' },
  { label: m.letter, value: '2550x3300@300' },
  { label: m.businessCard, value: '1004x650@300' },
  { label: m.custom, value: 'custom' },
];

/** `"2480x3508@300"` → size and optional resolution */
export function parseSizeValue(
  value: string
): { width: number; height: number; dpi?: number } | null {
  const match = /^(\d+)x(\d+)(?:@(\d+))?$/.exec(value);
  if (!match) return null;
  return {
    width: Number(match[1]),
    height: Number(match[2]),
    ...(match[3] && { dpi: Number(match[3]) }),
  };
}

export function useCanvasSize(
  editor: Editor | null,
  onDpiChange: (dpi: number) => void
) {
  const [customOpen, setCustomOpen] = useState(false);

  const frame = useFrame() as { width?: number; height?: number } | null;
  const width = frame?.width
    ? Math.round(frame.width)
    : defaultFrameOptions.width;
  const height = frame?.height
    ? Math.round(frame.height)
    : defaultFrameOptions.height;

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
        setCustomOpen(true);
        return;
      }
      setCustomOpen(false);
      const parsed = parseSizeValue(value);
      if (!parsed) return;
      if (parsed.dpi) onDpiChange(parsed.dpi);
      applySize(parsed.width, parsed.height);
    },
    [applySize, onDpiChange]
  );

  return {
    size: `${width}x${height}`,
    frame: { width, height },
    customOpen,
    setCustomOpen,
    applySize,
    handleSizeChange,
  };
}
