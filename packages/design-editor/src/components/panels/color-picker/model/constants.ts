import type { CSSProperties } from 'react';

export const TOOL_BTN: CSSProperties = {
  width: 34,
  height: 34,
  border: 'none',
  borderRadius: 9,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  background: 'color-mix(in srgb, var(--de-color-text) 5%, transparent)',
  color: 'var(--de-color-text-muted)',
  transition: 'all 0.15s',
  outline: 'none',
};

// ─── Modern Property Color Picker (fixed: no nested Radix Tooltip in trigger) ──
export const SWATCHES = [
  // Row 1 — Neutrals
  '#ffffff',
  '#f5f5f5',
  '#e0e0e0',
  '#9e9e9e',
  '#616161',
  '#212121',
  '#000000',
  // Row 2 — Warm
  '#ffebee',
  '#ef5350',
  '#e53935',
  '#c62828',
  '#ff7043',
  '#ff8f00',
  '#f9a825',
  // Row 3 — Cool
  '#e8f5e9',
  '#66bb6a',
  '#2e7d32',
  '#26c6da',
  '#0288d1',
  '#1565c0',
  '#7b1fa2',
  // Row 4 — Vibrant
  '#f06292',
  '#ba68c8',
  '#7986cb',
  '#4dd0e1',
  '#4db6ac',
  '#aed581',
  '#fff176',
  // Row 5 — Pastels
  '#fce4ec',
  '#f3e5f5',
  '#e8eaf6',
  '#e1f5fe',
  '#e0f2f1',
  '#f1f8e9',
  '#fffde7',
];
