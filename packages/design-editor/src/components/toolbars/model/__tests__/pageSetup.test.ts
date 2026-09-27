// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { pageSetupFromPixels, pageSetupToPixels } from '../pageSetup';

describe('pageSetupToPixels', () => {
  it('turns an A4 trim with 3 mm bleed into a frame and offsets', () => {
    const setup = pageSetupToPixels({
      unit: 'mm',
      width: 210,
      height: 297,
      bleed: 3,
      dpi: 300,
    });
    expect(setup).toEqual({
      width: 2480 + 35 * 2,
      height: 3508 + 35 * 2,
      offsets: { top: 35, right: 35, bottom: 35, left: 35 },
      dpi: 300,
    });
  });

  it('works in inches and pixels', () => {
    expect(
      pageSetupToPixels({
        unit: 'in',
        width: 8.5,
        height: 11,
        bleed: 0,
        dpi: 150,
      })
    ).toMatchObject({ width: 1275, height: 1650 });
    expect(
      pageSetupToPixels({
        unit: 'px',
        width: 800,
        height: 600,
        bleed: 10,
        dpi: 72,
      })
    ).toMatchObject({ width: 820, height: 620 });
  });

  it('clamps sizes and repairs a broken dpi', () => {
    const setup = pageSetupToPixels({
      unit: 'px',
      width: 1,
      height: 99999,
      bleed: -5,
      dpi: Number.NaN,
    });
    expect(setup).toMatchObject({ width: 50, height: 10000, dpi: 300 });
  });
});

describe('pageSetupFromPixels', () => {
  it('reads equal offsets back as bleed', () => {
    expect(
      pageSetupFromPixels(
        { width: 2550, height: 3578 },
        { top: 35, right: 35, bottom: 35, left: 35 },
        'mm',
        300
      )
    ).toEqual({ width: 209.97, height: 297.01, bleed: 2.96 });
  });

  it('treats uneven offsets as margins, not bleed', () => {
    expect(
      pageSetupFromPixels(
        { width: 1000, height: 500 },
        { top: 10, right: 0, bottom: 10, left: 0 },
        'px',
        300
      )
    ).toEqual({ width: 1000, height: 500, bleed: 0 });
  });
});
