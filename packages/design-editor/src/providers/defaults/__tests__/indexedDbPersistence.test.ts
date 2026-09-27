// Created by Claude (Claude Code).
import { beforeEach, describe, expect, it } from 'vitest';

import { createIndexedDBPersistence } from '../indexedDbPersistence';
import { createIndexedDbStore } from '../indexedDbStore';

import type { IScene } from '../../../engine';

const scene = (id: string) =>
  ({
    id,
    frame: { width: 100, height: 100 },
    layers: [],
    metadata: {},
  }) as unknown as IScene;

beforeEach(() => localStorage.clear());

describe('createIndexedDBPersistence (localStorage fallback in jsdom)', () => {
  it('saves, loads, lists and removes scenes', async () => {
    const persistence = createIndexedDBPersistence();
    await persistence.save('a', scene('a'));
    await persistence.save('b', scene('b'));

    expect(await persistence.load('a')).toEqual(scene('a'));
    expect(await persistence.load('missing')).toBeNull();

    const listed = (await persistence.list?.()) ?? [];
    expect(listed.map((entry) => entry.sceneKey).sort()).toEqual(['a', 'b']);
    expect(listed.every((entry) => entry.updatedAt > 0)).toBe(true);

    await persistence.remove?.('a');
    expect(await persistence.load('a')).toBeNull();
  });

  it('reads records that kept the backgrounds next to the scene', async () => {
    await createIndexedDbStore('design-editor', 'autosave').set('old', {
      scene: scene('old'),
      canvasBg: '#123456',
      workspaceBg: '#eeeeee',
    });

    const loaded = await createIndexedDBPersistence().load('old');
    expect(loaded?.metadata.editor).toEqual({
      canvasBg: '#123456',
      workspaceBg: '#eeeeee',
    });
  });
});
