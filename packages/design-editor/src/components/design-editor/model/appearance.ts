import type { CSSProperties } from 'react';

/** Palette of the editor UI; each entry maps to a --de-* CSS variable. */
export interface EditorColors {
  /** Editor chrome background */
  bg?: string;
  /** Area around the page */
  workspace?: string;
  /** Toolbars and panels */
  surface?: string;
  /** Inputs and raised controls */
  surface2?: string;
  /** Popovers and menus */
  elevated?: string;
  hover?: string;
  border?: string;
  borderStrong?: string;
  text?: string;
  textMuted?: string;
  primary?: string;
  primaryFg?: string;
  primarySoft?: string;
  danger?: string;
  dangerSoft?: string;
  shadow?: string;
}

export interface EditorFonts {
  /** Font stack of the editor UI */
  ui?: string;
  /** Monospace font stack */
  mono?: string;
}

export interface EditorAppearance {
  /** Replaces the built-in palettes; the Dark/Light switcher is hidden */
  colors?: EditorColors;
  fonts?: EditorFonts;
}

export type EditorTheme = 'dark' | 'light';

const COLOR_VARIABLES: Record<keyof EditorColors, string> = {
  bg: '--de-color-bg',
  workspace: '--de-color-workspace',
  surface: '--de-color-surface',
  surface2: '--de-color-surface-2',
  elevated: '--de-color-bg-elevated',
  hover: '--de-color-hover',
  border: '--de-color-border',
  borderStrong: '--de-color-border-strong',
  text: '--de-color-text',
  textMuted: '--de-color-text-muted',
  primary: '--de-color-primary',
  primaryFg: '--de-color-primary-fg',
  primarySoft: '--de-color-primary-soft',
  danger: '--de-color-danger',
  dangerSoft: '--de-color-danger-soft',
  shadow: '--de-shadow-color',
};

/** CSS variables for the editor root. */
export function appearanceStyle(
  appearance: EditorAppearance | undefined
): CSSProperties {
  const variables: Record<string, string> = {};
  const { colors = {}, fonts = {} } = appearance ?? {};
  (Object.keys(colors) as (keyof EditorColors)[]).forEach((key) => {
    const value = colors[key];
    if (value) variables[COLOR_VARIABLES[key]] = value;
  });
  if (fonts.ui) variables['--de-font-family'] = fonts.ui;
  if (fonts.mono) variables['--de-font-mono'] = fonts.mono;
  return variables;
}
