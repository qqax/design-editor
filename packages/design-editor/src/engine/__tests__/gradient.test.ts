// Created by Claude (Claude Code).
import { Gradient } from 'fabric';
import { describe, expect, it } from 'vitest';

import {
  createGradient,
  gradientToCss,
  isGradientFill,
  normalizeStops,
  reviveFill,
} from '../core/utils/gradient';

import type { GradientFill } from '../core/common/interfaces';

const stops = [
  { offset: 1, color: '#000000' },
  { offset: 0, color: '#ffffff' },
];

describe('normalizeStops', () => {
  it('sorts by offset and clamps to 0..1', () => {
    expect(
      normalizeStops([
        { offset: 1.5, color: 'a' },
        { offset: -1, color: 'b' },
        { offset: 0.4, color: 'c' },
      ])
    ).toEqual([
      { offset: 0, color: 'b' },
      { offset: 0.4, color: 'c' },
      { offset: 1, color: 'a' },
    ]);
  });
});

describe('createGradient', () => {
  it('runs a 90deg linear gradient from the left to the right edge', () => {
    const g = createGradient(200, 100, { type: 'linear', angle: 90, stops });
    expect(g.type).toBe('linear');
    expect(g.coords.x1).toBeCloseTo(0);
    expect(g.coords.y1).toBeCloseTo(50);
    expect(g.coords.x2).toBeCloseTo(200);
    expect(g.coords.y2).toBeCloseTo(50);
  });

  it('runs a 0deg linear gradient from the bottom to the top edge', () => {
    const g = createGradient(200, 100, { type: 'linear', angle: 0, stops });
    expect(g.coords.y1).toBeCloseTo(100);
    expect(g.coords.y2).toBeCloseTo(0);
  });

  it('centres a radial gradient and reaches the corners', () => {
    const g = createGradient(300, 400, { type: 'radial', angle: 0, stops });
    expect(g.type).toBe('radial');
    expect(g.coords).toMatchObject({
      x1: 150,
      y1: 200,
      x2: 150,
      y2: 200,
      r1: 0,
    });
    expect((g.coords as { r2?: number }).r2).toBeCloseTo(250);
  });

  it('keeps every stop in order', () => {
    const g = createGradient(10, 10, {
      type: 'linear',
      angle: 45,
      stops: [...stops, { offset: 0.5, color: '#ff0000' }],
    });
    expect(g.colorStops.map((s) => s.color)).toEqual([
      '#ffffff',
      '#ff0000',
      '#000000',
    ]);
  });
});

describe('gradientToCss', () => {
  it('renders linear and radial CSS', () => {
    expect(gradientToCss({ type: 'linear', angle: 45, stops })).toBe(
      'linear-gradient(45deg, #ffffff 0%, #000000 100%)'
    );
    expect(gradientToCss({ type: 'radial', angle: 0, stops })).toBe(
      'radial-gradient(circle farthest-corner, #ffffff 0%, #000000 100%)'
    );
  });
});

describe('isGradientFill', () => {
  it('accepts gradient specs only', () => {
    const fill: GradientFill = { type: 'radial', angle: 0, stops };
    expect(isGradientFill(fill)).toBe(true);
    expect(isGradientFill('#fff')).toBe(false);
    expect(isGradientFill({ type: 'conic', stops })).toBe(false);
    expect(isGradientFill(null)).toBe(false);
  });
});

describe('reviveFill', () => {
  it('turns a serialized gradient back into a Gradient', () => {
    const serialized = createGradient(100, 100, {
      type: 'linear',
      angle: 90,
      stops,
    }).toObject();
    const revived = reviveFill(JSON.parse(JSON.stringify(serialized)));
    expect(revived).toBeInstanceOf(Gradient);
    expect((revived as Gradient<'linear'>).colorStops).toHaveLength(2);
  });

  it('passes colors through and rejects other values', () => {
    expect(reviveFill('#123456')).toBe('#123456');
    expect(reviveFill({ foo: 1 })).toBeUndefined();
    expect(reviveFill(undefined)).toBeUndefined();
  });
});
