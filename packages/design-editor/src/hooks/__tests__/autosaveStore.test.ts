// Created by Claude (Claude Code).
import { beforeEach, describe, expect, it } from 'vitest';

import { createAutosaveStore, indexedDbBackend } from '../autosaveStore';

import type { AutosavePayload, KeyValueBackend } from '../autosaveStore';
import type { IScene } from '../../engine';

const memoryBackend = () => {
  const data = new Map<string, unknown>();
  const backend: KeyValueBackend = {
    get: async (key) => data.get(key),
    set: async (key, value) => {
      data.set(key, value);
    },
    delete: async (key) => {
      data.delete(key);
    },
  };
  return { data, backend };
};

const scene = {
  id: 's1',
  frame: { width: 100, height: 100 },
  layers: [],
  metadata: {},
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
  it('keeps the scene in the backend and the viewport in localStorage', async () => {
    const { data, backend } = memoryBackend();
    const store = createAutosaveStore(backend);
    await store.save('k', payload);

    expect(data.get('k')).toEqual({
      scene,
      canvasBg: payload.canvasBg,
      workspaceBg: '#eee',
    });
    expect(JSON.parse(localStorage.getItem('k:viewport') ?? 'null')).toEqual(
      payload.viewport
    );
    expect(await store.load('k')).toEqual(payload);
  });

  it('returns null when nothing was saved', async () => {
    const store = createAutosaveStore(memoryBackend().backend);
    expect(await store.load('missing')).toBeNull();
  });

  it('migrates a legacy localStorage autosave into the backend', async () => {
    const { data, backend } = memoryBackend();
    localStorage.setItem('k', JSON.stringify({ scene, workspaceBg: '#abc' }));
    const store = createAutosaveStore(backend);

    expect(await store.load('k')).toEqual({ scene, workspaceBg: '#abc' });
    expect(data.get('k')).toEqual({ scene, workspaceBg: '#abc' });
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('updates only the viewport without touching the scene', async () => {
    const { backend } = memoryBackend();
    const store = createAutosaveStore(backend);
    await store.save('k', payload);
    store.saveViewport('k', { zoom: 2, x: 0, y: 0 });

    expect((await store.load('k'))?.viewport).toEqual({ zoom: 2, x: 0, y: 0 });
  });

  it('clears the scene and the viewport', async () => {
    const { data, backend } = memoryBackend();
    const store = createAutosaveStore(backend);
    await store.save('k', payload);
    await store.clear('k');

    expect(data.has('k')).toBe(false);
    expect(localStorage.getItem('k:viewport')).toBeNull();
    expect(await store.load('k')).toBeNull();
  });
});

describe('indexedDbBackend', () => {
  it('falls back to localStorage without IndexedDB', async () => {
    const backend = indexedDbBackend();
    await backend.set('x', { a: 1 });
    expect(await backend.get('x')).toEqual({ a: 1 });
    await backend.delete('x');
    expect(await backend.get('x')).toBeUndefined();
  });
});
