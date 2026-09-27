// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { PROPERTIES_TO_INCLUDE } from '../core/common/constants';
import ObjectExporter from '../core/utils/object-exporter';
import { StaticImage } from '../objects';

import type { ILayer } from '../types';

const source = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 40;
  canvas.height = 20;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 40, 20);
  }
  return canvas as unknown as HTMLImageElement;
};

describe('StaticImage cornerRadius', () => {
  it('serializes and survives the exporter', () => {
    const image = new StaticImage(source(), {
      id: 'img',
      cornerRadius: 6,
      left: 0,
      top: 0,
    });
    const json = image.toObject(PROPERTIES_TO_INCLUDE) as unknown as ILayer & {
      cornerRadius?: number;
    };
    expect(json.cornerRadius).toBe(6);

    const frame = { left: 0, top: 0, width: 100, height: 100 };
    const exported = new ObjectExporter().export(
      { ...json, type: 'StaticImage' },
      frame as never
    ) as ILayer & { cornerRadius?: number };
    expect(exported.cornerRadius).toBe(6);
  });

  it('clips the corners when rendered', () => {
    const image = new StaticImage(source(), {
      id: 'img',
      cornerRadius: 8,
      left: 0,
      top: 0,
      originX: 'left',
      originY: 'top',
      objectCaching: false,
    });
    const target = document.createElement('canvas');
    target.width = 40;
    target.height = 20;
    const ctx = target.getContext('2d');
    if (!ctx) return;
    image.render(ctx);
    expect(ctx.getImageData(0, 0, 1, 1).data[3]).toBe(0);
    expect(ctx.getImageData(20, 10, 1, 1).data[3]).toBe(255);
  });
});
