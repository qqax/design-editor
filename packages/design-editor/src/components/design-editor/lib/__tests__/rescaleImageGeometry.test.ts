// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { rescaleImageGeometry } from '../rescaleImageGeometry';

const geometry = {
  width: 400,
  height: 300,
  cropX: 20,
  cropY: 10,
  scaleX: 1.1,
  scaleY: 0.7,
};

describe('rescaleImageGeometry', () => {
  it('keeps geometry for a source of the same resolution', () => {
    expect(
      rescaleImageGeometry(
        geometry,
        { width: 800, height: 600 },
        { width: 800, height: 600 }
      )
    ).toEqual(geometry);
  });

  it('keeps the displayed size and crop for a larger source', () => {
    const next = rescaleImageGeometry(
      geometry,
      { width: 800, height: 600 },
      { width: 1600, height: 1200 }
    );
    expect(next.width * next.scaleX).toBeCloseTo(
      geometry.width * geometry.scaleX
    );
    expect(next.height * next.scaleY).toBeCloseTo(
      geometry.height * geometry.scaleY
    );
    expect(next).toMatchObject({
      width: 800,
      height: 600,
      cropX: 40,
      cropY: 20,
    });
  });
});
