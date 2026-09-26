'use client';

import { useCallback, useState } from 'react';

import { defaultFrameOptions, useFrame } from '../../../engine';

import type { Editor } from '../../../engine';

export const AD_SIZES = [
  { label: '1920×1080 (Landscape)', value: '1920x1080' },
  { label: '1080×1080 (Square)', value: '1080x1080' },
  { label: '1080×1920 (Portrait)', value: '1080x1920' },
  { label: '728×90 (Leaderboard)', value: '728x90' },
  { label: '300×250 (Med Rect)', value: '300x250' },
  { label: 'Custom…', value: 'custom' },
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
