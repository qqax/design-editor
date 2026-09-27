// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import {
  NO_OFFSETS,
  OFFSET_GUIDE_PREFIX,
  offsetGuides,
  snapOffset,
} from '../core/utils/guides';

import type { Guide } from '../core/utils/guides';

const rect = { left: 100, top: 200, width: 50, height: 40 };
const guide = (axis: Guide['axis'], position: number): Guide => ({
  id: `${axis}${position}`,
  axis,
  position,
});

describe('snapOffset', () => {
  it('snaps the left edge, centre or right edge to a vertical guide', () => {
    expect(snapOffset(rect, [guide('x', 97)], 5)).toEqual({ x: -3, y: 0 });
    expect(snapOffset(rect, [guide('x', 127)], 5)).toEqual({ x: 2, y: 0 });
    expect(snapOffset(rect, [guide('x', 152)], 5)).toEqual({ x: 2, y: 0 });
  });

  it('snaps top, middle or bottom to a horizontal guide', () => {
    expect(snapOffset(rect, [guide('y', 238)], 5)).toEqual({ x: 0, y: -2 });
    expect(snapOffset(rect, [guide('y', 221)], 5)).toEqual({ x: 0, y: 1 });
  });

  it('ignores guides beyond the threshold', () => {
    expect(snapOffset(rect, [guide('x', 80), guide('y', 260)], 5)).toEqual({
      x: 0,
      y: 0,
    });
  });

  it('prefers the nearest guide and snaps both axes', () => {
    expect(
      snapOffset(rect, [guide('x', 104), guide('x', 101), guide('y', 199)], 5)
    ).toEqual({ x: 1, y: -1 });
  });
});

describe('offsetGuides', () => {
  it('marks every non-zero offset with a permanent guide', () => {
    expect(
      offsetGuides({ top: 10, right: 20, bottom: 0, left: 40 }, 1000, 500)
    ).toEqual([
      { id: `${OFFSET_GUIDE_PREFIX}left`, axis: 'x', position: 40 },
      { id: `${OFFSET_GUIDE_PREFIX}right`, axis: 'x', position: 980 },
      { id: `${OFFSET_GUIDE_PREFIX}top`, axis: 'y', position: 10 },
    ]);
  });

  it('has no guides without offsets', () => {
    expect(offsetGuides(NO_OFFSETS, 1000, 500)).toEqual([]);
  });
});
