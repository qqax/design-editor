// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { FontLoader } from '../core/utils/font-loader';
import { DEFAULT_LAYER_LABELS } from '../core/utils/layer-name';
import ObjectExporter from '../core/utils/object-exporter';
import ObjectImporter from '../core/utils/object-importer';
import RenderObjectImporter from '../core/utils/object-importer-render';
import { StaticText } from '../objects';

import type { Editor } from '../core/editor';
import type { ILayer, IStaticText } from '../types';

const frame = {
  left: 0,
  top: 0,
  width: 1080,
  height: 1080,
  originX: 'left',
  originY: 'top',
} as unknown as Required<ILayer>;

const editor = {
  canvas: { canvas: { getObjects: () => [] } },
  fonts: new FontLoader(),
  layerLabels: DEFAULT_LAYER_LABELS,
} as unknown as Editor;

const layer = (overrides: Partial<IStaticText> = {}) =>
  ({
    id: 'text-1',
    type: 'StaticText',
    left: 10,
    top: 20,
    width: 300,
    text: 'Hello',
    fontFamily: 'Lato',
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'italic',
    ...overrides,
  }) as unknown as Required<ILayer>;

describe('text style round trip', () => {
  it('exports fontWeight and fontStyle', () => {
    const text = new StaticText({
      text: 'Hello',
      fontWeight: 'bold',
      fontStyle: 'italic',
    });
    const exported = new ObjectExporter().export(
      text.toObject(),
      frame
    ) as IStaticText;

    expect(exported.fontWeight).toBe('bold');
    expect(exported.fontStyle).toBe('italic');
  });

  it('imports fontWeight and fontStyle onto the canvas object', async () => {
    const text = await new ObjectImporter(editor).staticText(
      layer(),
      frame,
      false
    );

    expect(text.fontWeight).toBe('bold');
    expect(text.fontStyle).toBe('italic');
  });

  it('imports fontWeight and fontStyle for thumbnails', async () => {
    const text = await new RenderObjectImporter(new FontLoader()).staticText(
      layer()
    );

    expect(text.fontWeight).toBe('bold');
    expect(text.fontStyle).toBe('italic');
  });

  it('keeps defaults when the layer has no weight or style', async () => {
    const text = await new ObjectImporter(editor).staticText(
      layer({ fontWeight: undefined, fontStyle: undefined }),
      frame,
      false
    );

    expect(text.fontWeight).toBe('normal');
    expect(text.fontStyle).toBe('normal');
  });
});
