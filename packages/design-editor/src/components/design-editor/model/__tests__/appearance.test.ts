// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { appearanceStyle } from '../appearance';

describe('appearanceStyle', () => {
  it('maps colors and fonts to CSS variables', () => {
    expect(
      appearanceStyle({
        colors: { primary: '#ff5a1f', surface: '#101010', text: '' },
        fonts: { ui: 'Inter, sans-serif' },
      })
    ).toEqual({
      '--de-color-primary': '#ff5a1f',
      '--de-color-surface': '#101010',
      '--de-font-family': 'Inter, sans-serif',
    });
  });

  it('is empty without an appearance', () => {
    expect(appearanceStyle(undefined)).toEqual({});
  });
});
