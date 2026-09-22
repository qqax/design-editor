import { LayerType } from '../../types';

import type { IGroup, ILayer, IScene, IStaticText } from '../../types';

/**
 * Loads a font family that is not self-describing via `fontURL`.
 * Wired to the host's `FontProvider.load` by `<DesignEditor>`.
 */
export type FontResolver = (family: string) => Promise<void> | void;

export interface FontRef {
  family: string;
  url?: string;
}

type LayerLike = Partial<ILayer> | undefined | null;

const TEXT_LAYER_TYPES = new Set<string>([
  LayerType.STATIC_TEXT,
  LayerType.DYNAMIC_TEXT,
]);

/** `"'Open Sans', sans-serif"` -> `Open Sans` */
function normalizeFamily(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const [first] = raw.split(',');
  return first?.trim().replace(/^['"]|['"]$/g, '') || undefined;
}

function hasFontsApi(): boolean {
  return typeof document !== 'undefined' && 'fonts' in document;
}

function toLayers(source: IScene | LayerLike[] | LayerLike): LayerLike[] {
  if (!source) return [];
  if (Array.isArray(source)) return source;
  if ('layers' in source && Array.isArray(source.layers)) return source.layers;
  return [source];
}

function collectInto(layers: LayerLike[], refs: Map<string, FontRef>): void {
  layers.forEach((layer) => {
    if (!layer) return;

    if (layer.type && TEXT_LAYER_TYPES.has(layer.type)) {
      const { fontFamily, fontURL } = layer as Partial<IStaticText>;
      const family = normalizeFamily(fontFamily);
      // An embedded URL wins over a bare name for the same family.
      if (family && (!refs.get(family)?.url || fontURL)) {
        refs.set(family, { family, ...(fontURL && { url: fontURL }) });
      }
    }

    const { objects } = layer as Partial<IGroup>;
    if (Array.isArray(objects)) collectInto(objects, refs);
  });
}

/**
 * Detects the fonts a scene, layer or thumbnail needs and guarantees they are
 * usable before anything is measured or drawn.
 *
 * Fabric measures glyphs as a text object is constructed, so a face that
 * arrives afterwards yields both the wrong typeface and the wrong layout.
 * Every import path funnels through here first.
 */
class FontLoader {
  private resolver: FontResolver | null = null;

  private readonly settled = new Set<string>();

  private readonly inFlight = new Map<string, Promise<void>>();

  public setResolver(resolver: FontResolver | null): void {
    this.resolver = resolver;
  }

  /** Walks layers (groups included) and returns each distinct font they need. */
  // eslint-disable-next-line class-methods-use-this
  public collect(source: IScene | LayerLike[] | LayerLike): FontRef[] {
    const refs = new Map<string, FontRef>();
    collectInto(toLayers(source), refs);
    return [...refs.values()];
  }

  /** Resolves once every font the scene references is ready to render. */
  public async ensure(source: IScene | LayerLike[] | LayerLike): Promise<void> {
    const refs = this.collect(source);
    if (!refs.length) return;

    await Promise.all(
      refs.map(async (ref) => this.ensureFamily(ref.family, ref.url))
    );
  }

  /**
   * Resolves once `family` is ready. Never rejects: a font that cannot be
   * fetched falls back to the default face rather than failing the render.
   */
  public async ensureFamily(family: unknown, url?: string): Promise<void> {
    const name = normalizeFamily(family);
    if (!name || this.settled.has(name)) return;

    const pending = this.inFlight.get(name);
    if (pending) {
      await pending;
      return;
    }

    const task = this.loadFamily(name, url)
      .catch(() => {
        // Unavailable font: fall through to the canvas default face.
      })
      .finally(() => {
        this.inFlight.delete(name);
        this.settled.add(name);
      });

    this.inFlight.set(name, task);
    await task;
  }

  /** Forgets cached results so a newly uploaded face is picked up. */
  public invalidate(family?: string): void {
    const name = normalizeFamily(family);
    if (name) {
      this.settled.delete(name);
      this.inFlight.delete(name);
      return;
    }
    this.settled.clear();
    this.inFlight.clear();
  }

  private async loadFamily(family: string, url?: string): Promise<void> {
    if (!hasFontsApi()) return;

    if (url) {
      const face = await new FontFace(family, `url(${url})`).load();
      document.fonts.add(face);
      return;
    }

    await this.resolver?.(family);
    await document.fonts.load(`1em "${family}"`);
  }
}

export const fontLoader = new FontLoader();
