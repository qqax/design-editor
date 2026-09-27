// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import {
  pickRulerStep,
  placeRulers,
  RULER_SIZE,
  rulerSign,
  rulerZero,
  sidesAt,
} from '../rulers';

const offsets = { top: 10, right: 20, bottom: 30, left: 40 };
const frameSize = { width: 1000, height: 500 };

describe('pickRulerStep', () => {
  it('keeps labels at least 60px apart', () => {
    expect(pickRulerStep(1)).toBe(100);
    expect(pickRulerStep(0.5)).toBe(200);
    expect(pickRulerStep(0.25)).toBe(250);
    expect(pickRulerStep(3)).toBe(20);
  });

  it('falls back to the largest step when zoomed far out', () => {
    expect(pickRulerStep(0.001)).toBe(5000);
  });
});

describe('rulerZero and rulerSign', () => {
  it('counts from the left/top offset line by default', () => {
    const origin = { x: 'left', y: 'top' } as const;
    expect(rulerZero('x', origin, offsets, frameSize)).toBe(40);
    expect(rulerZero('y', origin, offsets, frameSize)).toBe(10);
    expect(rulerSign('x', origin)).toBe(1);
    expect(rulerSign('y', origin)).toBe(1);
  });

  it('counts backwards from the right/bottom offset line', () => {
    const origin = { x: 'right', y: 'bottom' } as const;
    expect(rulerZero('x', origin, offsets, frameSize)).toBe(980);
    expect(rulerZero('y', origin, offsets, frameSize)).toBe(470);
    expect(rulerSign('x', origin)).toBe(-1);
    expect(rulerSign('y', origin)).toBe(-1);
  });
});

describe('placeRulers', () => {
  const visible = { left: 100, top: 0, right: 900, bottom: 700 };

  it('attaches the rulers outside visible frame edges', () => {
    const frame = { left: 300, top: 150, right: 700, bottom: 550 };
    expect(
      placeRulers(frame, visible, { horizontal: 'top', vertical: 'left' })
    ).toEqual({ top: 150 - RULER_SIZE, left: 300 - RULER_SIZE });
    expect(
      placeRulers(frame, visible, { horizontal: 'bottom', vertical: 'right' })
    ).toEqual({ top: 550, left: 700 });
  });

  it('sticks to the visible edges when frame edges are out of view', () => {
    const frame = { left: -200, top: -100, right: 1500, bottom: 1200 };
    expect(
      placeRulers(frame, visible, { horizontal: 'top', vertical: 'left' })
    ).toEqual({ top: 0, left: 100 });
    expect(
      placeRulers(frame, visible, { horizontal: 'bottom', vertical: 'right' })
    ).toEqual({ top: 700 - RULER_SIZE, left: 900 - RULER_SIZE });
  });
});

describe('sidesAt', () => {
  it('picks the quadrant of the visible area', () => {
    const visible = { left: 0, top: 0, right: 800, bottom: 600 };
    expect(sidesAt(10, 10, visible)).toEqual({
      horizontal: 'top',
      vertical: 'left',
    });
    expect(sidesAt(790, 590, visible)).toEqual({
      horizontal: 'bottom',
      vertical: 'right',
    });
  });
});
