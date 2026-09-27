// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { FontLoader } from '../core/utils/font-loader';
import {
  createLayerName,
  DEFAULT_LAYER_LABELS,
  getLayerLabel,
  resolveLayerLabels,
} from '../core/utils/layer-name';
import ObjectImporter from '../core/utils/object-importer';
import { StaticText } from '../objects';

import type { FabricObject } from 'fabric';

import type { Editor } from '../core/editor';
import type { ILayer } from '../types';

const frame = {
  left: 0,
  top: 0,
  width: 1080,
  height: 1080,
  originX: 'left',
  originY: 'top',
} as unknown as Required<ILayer>;

const editorWith = (objects: FabricObject[], labels = DEFAULT_LAYER_LABELS) =>
  ({
    canvas: { canvas: { getObjects: () => objects } },
    fonts: new FontLoader(),
    layerLabels: labels,
  }) as unknown as Editor;

const textLayer = (id: string, name?: string) =>
  ({ id, name, type: 'StaticText', text: id }) as unknown as Required<ILayer>;

describe('createLayerName', () => {
  it('numbers generic names by layer label', () => {
    const taken = new Set<string>();
    expect(createLayerName('StaticText', undefined, taken)).toBe('Text 1');
    expect(createLayerName('StaticImage', 'StaticImage', taken)).toBe(
      'Image 1'
    );
    expect(createLayerName('StaticPath', 'staticpath', taken)).toBe('Shape 1');
  });

  it('takes the lowest free ordinal', () => {
    const taken = new Set(['Text 1', 'Text 3']);
    expect(createLayerName('StaticText', '', taken)).toBe('Text 2');
  });

  it('keeps a meaningful unique name', () => {
    expect(createLayerName('StaticText', 'Headline', new Set())).toBe(
      'Headline'
    );
  });

  it('numbers a meaningful name that is already taken', () => {
    expect(
      createLayerName('StaticText', 'Headline', new Set(['Headline']))
    ).toBe('Headline 1');
    expect(
      createLayerName('StaticText', 'Text 1', new Set(['Text 1', 'Text 2']))
    ).toBe('Text 3');
  });

  it('falls back to a generic label for unknown types', () => {
    expect(getLayerLabel('Unknown')).toBe('Layer');
    expect(getLayerLabel(undefined)).toBe('Layer');
  });
});

describe('ObjectImporter layer names', () => {
  it('gives layers of one import distinct names', async () => {
    const importer = new ObjectImporter(editorWith([]));
    const first = await importer.staticText(
      textLayer('a', 'StaticText'),
      frame,
      false
    );
    const second = await importer.staticText(
      textLayer('b', 'StaticText'),
      frame,
      false
    );

    expect(first.name).toBe('Text 1');
    expect(second.name).toBe('Text 2');
  });

  it('skips names already used on the canvas', async () => {
    const existing = Object.assign(new StaticText({ text: 'x' }), {
      name: 'Text 1',
    });
    const importer = new ObjectImporter(editorWith([existing]));
    const text = await importer.staticText(textLayer('c'), frame, false);

    expect(text.name).toBe('Text 2');
  });

  it('always names the page background "Background"', async () => {
    const importer = new ObjectImporter(editorWith([]));
    const background = await importer.background(
      {
        id: 'bg',
        type: 'Background',
        name: 'Initial Frame',
        fill: '#fff',
      } as unknown as Required<ILayer>,
      frame,
      false
    );

    expect(background.name).toBe('Background');
  });
});

describe('localized labels', () => {
  const ru = resolveLayerLabels({ text: 'Текст', shape: 'Фигура' });

  it('name new layers and still treat English labels as generic', () => {
    expect(createLayerName('StaticText', undefined, new Set(), ru)).toBe(
      'Текст 1'
    );
    expect(createLayerName('StaticPath', 'Shape', new Set(), ru)).toBe(
      'Фигура 1'
    );
    expect(createLayerName('StaticImage', undefined, new Set(), ru)).toBe(
      'Image 1'
    );
    expect(getLayerLabel('StaticText')).toBe('Text');
  });

  it('ignore extra entries, so custom names stay meaningful', () => {
    const labels = resolveLayerLabels({ backdrop: 'Backdrop' } as never);
    expect(createLayerName('StaticPath', 'Backdrop', new Set(), labels)).toBe(
      'Backdrop'
    );
  });

  it('come from the importing editor', async () => {
    const importer = new ObjectImporter(editorWith([], ru));
    const text = await importer.staticText(textLayer('a'), frame, false);
    expect(text.name).toBe('Текст 1');
  });
});
