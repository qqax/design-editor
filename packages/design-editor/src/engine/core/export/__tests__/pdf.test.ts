// Created by Claude (Claude Code).
import { deflateSync } from 'node:zlib';

import { describe, expect, it } from 'vitest';

import { buildPdf, CROP_MARK_GAP, CROP_MARK_LENGTH } from '../pdf';
import { splitChannels } from '../raster';
import { mmToPx, pxToMm, pxToPt } from '../units';

import type { PdfImage } from '../pdf';

const latin1 = (bytes: Uint8Array) => Buffer.from(bytes).toString('latin1');

const image = (withAlpha = false): PdfImage => {
  const rgba = new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, withAlpha ? 0 : 255]);
  const { rgb, alpha } = splitChannels(rgba);
  return {
    width: 2,
    height: 1,
    filter: 'FlateDecode',
    data: new Uint8Array(deflateSync(rgb)),
    ...(alpha && { alpha: new Uint8Array(deflateSync(alpha)) }),
  };
};

describe('buildPdf', () => {
  it('writes a well-formed single page file with a valid xref', () => {
    const bytes = buildPdf(image(), { width: 144, height: 72, title: 'A (b)' });
    const text = latin1(bytes);

    expect(text.startsWith('%PDF-1.4\n')).toBe(true);
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true);
    expect(text).toContain('/MediaBox [0 0 144 72]');
    expect(text).toContain('/Title (A \\(b\\))');

    const startxref = Number(/startxref\n(\d+)/.exec(text)?.[1]);
    expect(text.slice(startxref, startxref + 4)).toBe('xref');

    const entries = [...text.slice(startxref).matchAll(/(\d{10}) 00000 n /g)];
    expect(entries.length).toBe(6);
    entries.forEach(([, offset], index) => {
      const at = Number(offset);
      expect(text.slice(at, at + `${index + 1} 0 obj`.length)).toBe(`${index + 1} 0 obj`);
    });
  });

  it('adds a soft mask only for transparent pixels', () => {
    expect(latin1(buildPdf(image(), { width: 10, height: 10 }))).not.toContain('/SMask');
    const text = latin1(buildPdf(image(true), { width: 10, height: 10 }));
    expect(text).toContain('/SMask 6 0 R');
    expect(text).toContain('/ColorSpace /DeviceGray');
  });

  it('places trim and crop marks outside the bleed', () => {
    const margin = CROP_MARK_GAP + CROP_MARK_LENGTH;
    const text = latin1(
      buildPdf(image(), {
        width: 100,
        height: 50,
        trim: { top: 5, right: 5, bottom: 5, left: 5 },
        cropMarks: true,
      })
    );
    expect(text).toContain(`/MediaBox [0 0 ${100 + margin * 2} ${50 + margin * 2}]`);
    expect(text).toContain(`/BleedBox [${margin} ${margin} ${margin + 100} ${margin + 50}]`);
    expect(text).toContain(
      `/TrimBox [${margin + 5} ${margin + 5} ${margin + 95} ${margin + 45}]`
    );
    expect(text.match(/ l S/g)).toHaveLength(8);
  });
});

describe('units', () => {
  it('converts between pixels, millimetres and points', () => {
    expect(pxToPt(300, 300)).toBe(72);
    expect(pxToMm(2480, 300)).toBeCloseTo(209.97, 2);
    expect(mmToPx(210, 300)).toBe(2480);
  });
});

describe('splitChannels', () => {
  it('drops alpha when everything is opaque', () => {
    const { rgb, alpha } = splitChannels(new Uint8ClampedArray([1, 2, 3, 255]));
    expect([...rgb]).toEqual([1, 2, 3]);
    expect(alpha).toBeNull();
  });
});
