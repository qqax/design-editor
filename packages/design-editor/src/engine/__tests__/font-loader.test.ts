// Checked and updated by Claude (Claude Code).
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { collectFonts, FontLoader } from '../core/utils/font-loader';
import { LayerType } from '../types';

import type { IScene } from '../types';

function stubFontsApi() {
  const load = vi.fn().mockResolvedValue([]);
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { load, add: vi.fn() },
  });
  return load;
}

function scene(layers: any[]): IScene {
  return {
    id: 's1',
    frame: { width: 100, height: 100 },
    layers,
    metadata: {},
  };
}

function text(fontFamily: string, extra: Record<string, unknown> = {}) {
  return {
    id: 't',
    type: LayerType.STATIC_TEXT,
    text: 'hi',
    fontFamily,
    ...extra,
  };
}

describe('collectFonts', () => {
  it('finds each distinct family a scene references', () => {
    const refs = collectFonts(
      scene([text('Lato'), text('Anton'), text('Lato')])
    );
    expect(refs.map((r) => r.family).sort()).toEqual(['Anton', 'Lato']);
  });

  it('recurses into groups', () => {
    const refs = collectFonts(
      scene([
        {
          id: 'g',
          type: LayerType.GROUP,
          objects: [
            text('Oswald'),
            { id: 'g2', type: LayerType.GROUP, objects: [text('Pacifico')] },
          ],
        },
      ])
    );
    expect(refs.map((r) => r.family).sort()).toEqual(['Oswald', 'Pacifico']);
  });

  it('ignores layers that carry no text', () => {
    const refs = collectFonts(
      scene([{ id: 'i', type: LayerType.STATIC_IMAGE, src: 'a.png' }])
    );
    expect(refs).toEqual([]);
  });

  it('reduces a font stack to the first family', () => {
    const refs = collectFonts(scene([text("'Open Sans', sans-serif")]));
    expect(refs).toEqual([{ family: 'Open Sans' }]);
  });

  it('keeps an embedded fontURL over a bare name for the same family', () => {
    const refs = collectFonts(
      scene([text('Custom'), text('Custom', { fontURL: 'https://x/f.woff2' })])
    );
    expect(refs).toEqual([{ family: 'Custom', url: 'https://x/f.woff2' }]);
  });

  it('accepts a single layer as well as a scene', () => {
    expect(collectFonts(text('Roboto'))).toEqual([{ family: 'Roboto' }]);
  });
});

describe('FontLoader.ensure', () => {
  let fontLoader: FontLoader;

  beforeEach(() => {
    fontLoader = new FontLoader();
  });

  it('resolves every family through the registered resolver', async () => {
    const fontsLoad = stubFontsApi();
    const resolver = vi.fn().mockResolvedValue(undefined);
    fontLoader.setResolver(resolver);

    await fontLoader.ensure(scene([text('Lato'), text('Anton')]));

    const families = resolver.mock.calls.map(([family]) => String(family));
    expect(families.sort((a, b) => a.localeCompare(b))).toEqual([
      'Anton',
      'Lato',
    ]);
    expect(fontsLoad).toHaveBeenCalledWith('1em "Lato"');
  });

  it('loads each family only once', async () => {
    stubFontsApi();
    const resolver = vi.fn().mockResolvedValue(undefined);
    fontLoader.setResolver(resolver);

    await fontLoader.ensure(scene([text('Lato')]));
    await fontLoader.ensure(scene([text('Lato')]));

    expect(resolver).toHaveBeenCalledTimes(1);
  });

  it('shares one in-flight load between concurrent callers', async () => {
    stubFontsApi();
    const resolver = vi.fn().mockResolvedValue(undefined);
    fontLoader.setResolver(resolver);

    await Promise.all([
      fontLoader.ensureFamily('Lato'),
      fontLoader.ensureFamily('Lato'),
    ]);

    expect(resolver).toHaveBeenCalledTimes(1);
  });

  it('resolves rather than rejecting when a font is unavailable', async () => {
    stubFontsApi();
    fontLoader.setResolver(() => {
      throw new Error('offline');
    });

    await expect(fontLoader.ensureFamily('Missing')).resolves.toBeUndefined();
  });

  it('retries a family after it is invalidated', async () => {
    stubFontsApi();
    const resolver = vi.fn().mockResolvedValue(undefined);
    fontLoader.setResolver(resolver);

    await fontLoader.ensureFamily('Lato');
    fontLoader.invalidate('Lato');
    await fontLoader.ensureFamily('Lato');

    expect(resolver).toHaveBeenCalledTimes(2);
  });

  it('does nothing for a scene with no text', async () => {
    const fontsLoad = stubFontsApi();
    await fontLoader.ensure(scene([]));
    expect(fontsLoad).not.toHaveBeenCalled();
  });
});

describe('FontLoader instances', () => {
  it('keep their own resolver and cache', async () => {
    stubFontsApi();
    const first = vi.fn().mockResolvedValue(undefined);
    const second = vi.fn().mockResolvedValue(undefined);
    const a = new FontLoader();
    const b = new FontLoader();
    a.setResolver(first);
    b.setResolver(second);

    await a.ensureFamily('Lato');
    await b.ensureFamily('Lato');

    expect(first).toHaveBeenCalledWith('Lato');
    expect(second).toHaveBeenCalledWith('Lato');
  });
});
