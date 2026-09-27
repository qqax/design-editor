import { Color } from 'fabric';

export interface ColorParts {
  /** Opaque `#rrggbb` */
  hex: string;
  /** 0…1, rounded to two decimals */
  alpha: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function splitAlpha(color: string): ColorParts {
  const parsed = new Color(color.trim() || 'transparent');
  if (parsed.isUnrecognised) return { hex: '#000000', alpha: 1 };
  return {
    hex: `#${parsed.toHex().toLowerCase()}`,
    alpha: Math.round(parsed.getAlpha() * 100) / 100,
  };
}

/** `#rrggbb` when opaque, `#rrggbbaa` otherwise */
export function withAlpha(color: string, alpha: number): string {
  const { hex } = splitAlpha(color);
  const a = clamp01(alpha);
  if (a >= 1) return hex;
  return `${hex}${Math.round(a * 255)
    .toString(16)
    .padStart(2, '0')}`;
}

/** Normalizes user input (`fff`, `#ffffff`, `ffffff80`) or returns null */
export function parseHexInput(
  value: string,
  allowAlpha: boolean
): string | null {
  const clean = value.trim().replace(/^#/, '').toLowerCase();
  const pattern = allowAlpha
    ? /^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/
    : /^([0-9a-f]{3}|[0-9a-f]{6})$/;
  if (!pattern.test(clean)) return null;
  const { hex, alpha } = splitAlpha(`#${clean}`);
  return withAlpha(hex, alpha);
}

/** A CSS background layer that paints `color` flat, stackable over a checkerboard */
export const solidLayer = (color: string) =>
  `linear-gradient(${color}, ${color})`;
