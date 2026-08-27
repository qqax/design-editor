'use client';

import { useCallback, useState } from 'react';

export const AD_SIZES = [
  { label: '1920×1080 (Landscape)', value: '1920x1080' },
  { label: '1080×1080 (Square)', value: '1080x1080' },
  { label: '1080×1920 (Portrait)', value: '1080x1920' },
  { label: '728×90 (Leaderboard)', value: '728x90' },
  { label: '300×250 (Med Rect)', value: '300x250' },
  { label: 'Custom…', value: 'custom' },
];

export function useCanvasSize(editor: any) {
  const [size, setSize] = useState('1920x1080');
  const [customOpen, setCustomOpen] = useState(false);
  const [customW, setCustomW] = useState(1920);
  const [customH, setCustomH] = useState(1080);

  const applySize = useCallback(
    (w: number, h: number) => {
      if (!editor) return;
      editor.frame.resize({ width: w, height: h });
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
      setSize(value);
      const [w, h] = value.split('x').map(Number);
      applySize(w, h);
    },
    [applySize]
  );

  const handleApplyCustom = useCallback(() => {
    const w = Math.max(100, Math.min(8000, customW));
    const h = Math.max(100, Math.min(8000, customH));
    setCustomOpen(false);
    setSize(`${w}×${h}`);
    applySize(w, h);
  }, [customW, customH, applySize]);

  return {
    size,
    customOpen,
    setCustomOpen,
    customW,
    setCustomW,
    customH,
    setCustomH,
    handleSizeChange,
    handleApplyCustom,
  };
}
