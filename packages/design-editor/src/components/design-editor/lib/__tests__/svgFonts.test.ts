// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { googleFontCssUrl, svgFontCss } from '../svgFonts';

describe('svgFontCss', () => {
  it('imports Google families before custom font faces', () => {
    const css = svgFontCss(
      ['Brand Sans', 'Bebas Neue', 'Bebas Neue', 'Unknown'],
      [
        { family: 'Bebas Neue', source: 'google' },
        { family: 'Brand Sans', source: 'custom', url: 'https://cdn.test/brand.woff2' },
      ]
    );
    expect(css.split('\n')).toEqual([
      '@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");',
      '@font-face { font-family: "Brand Sans"; src: url("https://cdn.test/brand.woff2"); }',
    ]);
  });

  it('encodes family names for the Google CSS API', () => {
    expect(googleFontCssUrl('Noto Sans & Co')).toBe(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+%26+Co&display=swap'
    );
  });
});
