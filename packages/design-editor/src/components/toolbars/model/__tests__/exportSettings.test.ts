// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_EXPORT_SETTINGS,
  describeOutput,
  exportFileName,
  sanitizeExportSettings,
  toExportOptions,
} from '../exportSettings';

const NONE = { top: 0, right: 0, bottom: 0, left: 0 };
const BLEED = { top: 35, right: 35, bottom: 35, left: 35 };

describe('sanitizeExportSettings', () => {
  it('falls back to defaults for missing or broken values', () => {
    expect(sanitizeExportSettings(null)).toEqual(DEFAULT_EXPORT_SETTINGS);
    expect(
      sanitizeExportSettings({ format: 'gif', scale: 7, quality: 3, dpi: 96 })
    ).toEqual(DEFAULT_EXPORT_SETTINGS);
  });

  it('keeps valid values', () => {
    expect(
      sanitizeExportSettings({
        format: 'pdf',
        scale: 2,
        quality: 0.5,
        dpi: 150,
      })
    ).toMatchObject({ format: 'pdf', scale: 2, quality: 0.5, dpi: 150 });
  });
});

describe('toExportOptions', () => {
  it('passes only what each format uses', () => {
    expect(
      toExportOptions({ ...DEFAULT_EXPORT_SETTINGS, format: 'svg' }, BLEED)
    ).toEqual({
      format: 'svg',
    });
    expect(
      toExportOptions(
        { ...DEFAULT_EXPORT_SETTINGS, format: 'jpg', scale: 2 },
        BLEED
      )
    ).toEqual({ format: 'jpg', scale: 2, quality: 0.92 });
  });

  it('uses page offsets as the PDF trim only when set and enabled', () => {
    const pdf = { ...DEFAULT_EXPORT_SETTINGS, format: 'pdf' as const };
    expect(toExportOptions(pdf, BLEED).trim).toEqual(BLEED);
    expect(toExportOptions(pdf, NONE).trim).toBeUndefined();
    expect(
      toExportOptions({ ...pdf, trimAtOffsets: false }, BLEED).trim
    ).toBeUndefined();
  });
});

describe('describeOutput', () => {
  const a4 = { width: 2480, height: 3508 };

  it('reports pixels for raster output', () => {
    expect(
      describeOutput({ ...DEFAULT_EXPORT_SETTINGS, scale: 2 }, a4, NONE)
    ).toEqual({ width: 4960, height: 7016 });
  });

  it('reports the physical page and trim for PDF', () => {
    const summary = describeOutput(
      { ...DEFAULT_EXPORT_SETTINGS, format: 'pdf' },
      { width: 2550, height: 3578 },
      BLEED
    );
    expect(summary.page).toEqual({ width: 215.9, height: 302.9, dpi: 300 });
    expect(summary.trim).toEqual({ width: 210, height: 297 });
  });
});

describe('exportFileName', () => {
  it('sanitizes the scene name and adds the extension', () => {
    expect(exportFileName('My: poster / v2', 'pdf')).toBe('My-poster-v2.pdf');
  });

  it('falls back to a timestamp', () => {
    expect(exportFileName('', 'png', new Date('2026-09-27T10:20:30Z'))).toBe(
      'design-2026-09-27-10-20-30.png'
    );
  });
});
