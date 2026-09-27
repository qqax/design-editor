import { Pattern } from 'fabric';

const LIGHT = '#ffffff';
const DARK = '#d6d6d6';

/** Cell edge in scene pixels: about a hundred cells across the longer side */
export function checkerCellSize(width: number, height: number): number {
  return Math.max(8, Math.round(Math.max(width, height) / 100));
}

/** Transparency backdrop for the page; falls back to white without a 2D canvas */
export function createCheckerPattern(cell: number): Pattern | string {
  if (typeof document === 'undefined') return LIGHT;
  const source = document.createElement('canvas');
  source.width = cell * 2;
  source.height = cell * 2;
  const ctx = source.getContext('2d');
  if (!ctx) return LIGHT;
  ctx.fillStyle = LIGHT;
  ctx.fillRect(0, 0, cell * 2, cell * 2);
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, cell, cell);
  ctx.fillRect(cell, cell, cell, cell);
  return new Pattern({ source, repeat: 'repeat' });
}
