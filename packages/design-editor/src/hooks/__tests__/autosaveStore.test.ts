// Created by Claude (Claude Code).
import { beforeEach, describe, expect, it } from 'vitest';

import { createAutosaveStore } from '../autosaveStore';

import type { AutosavePayload } from '../autosaveStore';
import type { IScene } from '../../engine';
import type { PersistenceProvider } from '../../providers';

const memoryProvider = () => {
  const data = new Map<string, IScene>();
  const provider: PersistenceProvider = {
    save: async (key, scene) => {
      data.set(key, scene);
    },
    load: async (key) => data.get(key) ?? null,
    remove: async (key) => {
      data.delete(key);
    },
  };
  return { data, provider };
};

const scene = {
  id: 's1',
  frame: { width: 100, height: 100 },
  layers: [],
  metadata: { animated: false },
} as unknown as IScene;

const payload: AutosavePayload = {
  scene,
  canvasBg: {
    type: 'radial',
    angle: 0,
    stops: [
      { offset: 0, color: '#fff' },
      { offset: 1, color: '#000' },
    ],
  },
  workspaceBg: '#eee',
  viewport: { zoom: 0.5, x: 10, y: -20 },
};

beforeEach(() => localStorage.clear());

describe('createAutosaveStore', () => {
  it('saves backgrounds in the scene metadata and the viewport locally', async () => {
    const { data, provider } = memoryProvider();
    const store = createAutosaveStore(provider);
    await store.save('k', payload);

    expect(data.get('k')?.metadata).toEqual({
      animated: false,
      editor: { canvasBg: payload.canvasBg, workspaceBg: '#eee' },
    });
    expect(JSON.parse(localStorage.getItem('k:viewport') ?? 'null')).toEqual(
      payload.viewport
    );

    const loaded = await store.load('k');
    expect(loaded?.canvasBg).toEqual(payload.canvasBg);
    expect(loaded?.workspaceBg).toBe('#eee');
    expect(loaded?.viewport).toEqual(payload.viewport);
  });

  it('returns null when nothing was saved', async () => {
    const store = createAutosaveStore(memoryProvider().provider);
    expect(await store.load('missing')).toBeNull();
  });

  it('migrates a legacy localStorage autosave into the provider', async () => {
    const { data, provider } = memoryProvider();
    localStorage.setItem('k', JSON.stringify({ scene, workspaceBg: '#abc' }));
    const store = createAutosaveStore(provider);

    expect((await store.load('k'))?.workspaceBg).toBe('#abc');
    expect(data.get('k')?.metadata.editor).toEqual({ workspaceBg: '#abc' });
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('updates only the viewport without touching the scene', async () => {
    const store = createAutosaveStore(memoryProvider().provider);
    await store.save('k', payload);
    store.saveViewport('k', { zoom: 2, x: 0, y: 0 });

    expect((await store.load('k'))?.viewport).toEqual({ zoom: 2, x: 0, y: 0 });
  });

  it('clears the scene and the viewport', async () => {
    const { data, provider } = memoryProvider();
    const store = createAutosaveStore(provider);
    await store.save('k', payload);
    await store.clear('k');

    expect(data.has('k')).toBe(false);
    expect(localStorage.getItem('k:viewport')).toBeNull();
    expect(await store.load('k')).toBeNull();
  });
});
