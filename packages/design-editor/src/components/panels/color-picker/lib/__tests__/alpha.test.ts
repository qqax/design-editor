// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { parseHexInput, splitAlpha, withAlpha } from '../alpha';

describe('splitAlpha', () => {
  it('splits opaque and translucent hex', () => {
    expect(splitAlpha('#FF0000')).toEqual({ hex: '#ff0000', alpha: 1 });
    expect(splitAlpha('#ff000080')).toEqual({ hex: '#ff0000', alpha: 0.5 });
  });

  it('understands rgba() and transparent', () => {
    expect(splitAlpha('rgba(0, 0, 255, 0.25)')).toEqual({
      hex: '#0000ff',
      alpha: 0.25,
    });
    expect(splitAlpha('transparent').alpha).toBe(0);
    expect(splitAlpha('').alpha).toBe(0);
  });

  it('falls back to opaque black for garbage', () => {
    expect(splitAlpha('not-a-color')).toEqual({ hex: '#000000', alpha: 1 });
  });
});

describe('withAlpha', () => {
  it('keeps six digits when opaque', () => {
    expect(withAlpha('#00ff00', 1)).toBe('#00ff00');
    expect(withAlpha('#00ff0080', 1)).toBe('#00ff00');
  });

  it('appends the alpha byte and clamps', () => {
    expect(withAlpha('#00ff00', 0.5)).toBe('#00ff0080');
    expect(withAlpha('#00ff00', 0)).toBe('#00ff0000');
    expect(withAlpha('#00ff00', -1)).toBe('#00ff0000');
  });
});

describe('parseHexInput', () => {
  it('accepts short, long and alpha forms', () => {
    expect(parseHexInput('fff', false)).toBe('#ffffff');
    expect(parseHexInput('#12AB34', false)).toBe('#12ab34');
    expect(parseHexInput('12ab3480', true)).toBe('#12ab3480');
  });

  it('rejects alpha when not allowed and invalid input', () => {
    expect(parseHexInput('12ab3480', false)).toBeNull();
    expect(parseHexInput('zzz', true)).toBeNull();
  });
});
