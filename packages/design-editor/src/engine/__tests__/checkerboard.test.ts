// Created by Claude (Claude Code).
import { Pattern } from 'fabric';
import { describe, expect, it } from 'vitest';

import {
  checkerCellSize,
  createCheckerPattern,
} from '../core/utils/checkerboard';
import { Background } from '../objects/Background';
import { Frame } from '../objects/Frame';

describe('checkerboard', () => {
  it('scales the cell with the page but keeps a minimum', () => {
    expect(checkerCellSize(100, 100)).toBe(8);
    expect(checkerCellSize(1920, 1080)).toBe(19);
    expect(checkerCellSize(1080, 5000)).toBe(50);
  });

  it('builds a repeating two-cell pattern', () => {
    const pattern = createCheckerPattern(10);
    expect(pattern).toBeInstanceOf(Pattern);
    if (!(pattern instanceof Pattern)) return;
    expect(pattern.repeat).toBe('repeat');
    const source = pattern.source as HTMLCanvasElement;
    expect(source.width).toBe(20);
    expect(source.height).toBe(20);
  });
});

describe('Background', () => {
  it('never carries a shadow, so translucent fills stay clean', () => {
    const background = new Background({
      id: 'background',
      name: 'Background',
      fill: '#ff000080',
      shadow: { color: '#000', blur: 10, offsetX: 0, offsetY: 0 } as never,
    });
    expect(background.shadow).toBeNull();
    expect(background.toObject().fill).toBe('#ff000080');
  });
});

describe('Frame', () => {
  it('renders without an object cache, since it is also the clipPath', () => {
    const frame = new Frame({
      id: 'frame',
      name: 'Frame',
      width: 100,
      height: 100,
    } as never);
    expect(frame.objectCaching).toBe(false);
  });

  it('revives through the inherited fromObject', async () => {
    const background = await Background.fromObject({
      id: 'background',
      name: 'Background',
      fill: '#00000000',
      width: 10,
      height: 10,
    });
    expect(background).toBeInstanceOf(Background);
    expect(background.fill).toBe('#00000000');
  });
});
