// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { buildTextDesignLayers } from '../textDesignLayers';

import type { IScene } from '../../../../engine';

const scene = (layers: IScene['layers']): IScene => ({
  id: 'design',
  frame: { width: 800, height: 200 },
  layers,
  metadata: {},
});

const text = {
  id: 'title',
  name: 'Title',
  type: 'StaticText' as const,
  left: 20,
  top: 30,
  text: 'Hi',
};

const ids = () => {
  let n = 0;
  return () => {
    n += 1;
    return `id-${n}`;
  };
};

describe('buildTextDesignLayers', () => {
  it('centres the design and puts a backdrop of the canvas colour first', () => {
    const layers = buildTextDesignLayers(
      { scene: scene([text]), canvasBg: '#0277bd' },
      { width: 1920, height: 1080 },
      ids()
    );

    expect(layers).toHaveLength(2);
    const [backdrop, title] = layers;
    expect(backdrop).toMatchObject({
      id: 'id-2',
      name: 'Backdrop',
      type: 'StaticPath',
      left: 560,
      top: 440,
      width: 800,
      height: 200,
      fill: '#0277bd',
    });
    expect(title).toMatchObject({
      id: 'id-1',
      name: 'Title',
      left: 580,
      top: 470,
    });
  });

  it('skips the backdrop without a visible canvas colour', () => {
    const noColour = buildTextDesignLayers(
      { scene: scene([text]) },
      { width: 800, height: 200 },
      ids()
    );
    const transparent = buildTextDesignLayers(
      { scene: scene([text]), canvasBg: 'transparent' },
      { width: 800, height: 200 },
      ids()
    );
    expect(noColour.map((layer) => layer.type)).toEqual(['StaticText']);
    expect(transparent.map((layer) => layer.type)).toEqual(['StaticText']);
  });

  it('turns a page Background layer into the backdrop instead of replacing the page', () => {
    const layers = buildTextDesignLayers(
      {
        scene: scene([{ id: 'bg', type: 'Background', fill: '#111111' }, text]),
      },
      { width: 800, height: 200 },
      ids()
    );
    expect(layers.map((layer) => layer.type)).toEqual([
      'StaticPath',
      'StaticText',
    ]);
    expect(layers[0]).toMatchObject({ fill: '#111111', left: 0, top: 0 });
  });
});
