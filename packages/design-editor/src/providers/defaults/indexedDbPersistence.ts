import { createIndexedDbStore } from './indexedDbStore';

import type { IScene } from '../../engine';
import type { PersistenceProvider } from '../persistence';

interface StoredScene {
  scene: IScene;
  updatedAt?: number;
  /** Written by editor versions that kept backgrounds next to the scene */
  canvasBg?: unknown;
  workspaceBg?: unknown;
}

const isStoredScene = (value: unknown): value is StoredScene =>
  typeof value === 'object' && value !== null && 'scene' in value;

/**
 * Stores scenes in IndexedDB (database `design-editor`, store `autosave`),
 * falling back to localStorage where IndexedDB is unavailable.
 */
export function createIndexedDBPersistence(
  opts: { dbName?: string; storeName?: string } = {}
): PersistenceProvider {
  const store = createIndexedDbStore(
    opts.dbName ?? 'design-editor',
    opts.storeName ?? 'autosave'
  );

  const read = async (sceneKey: string) => {
    const record = await store.get(sceneKey);
    return isStoredScene(record) ? record : null;
  };

  return {
    async save(sceneKey, scene) {
      const record: StoredScene = { scene, updatedAt: Date.now() };
      await store.set(sceneKey, record);
    },

    async load(sceneKey) {
      const record = await read(sceneKey);
      if (!record) return null;
      const { scene, canvasBg, workspaceBg } = record;
      if (canvasBg === undefined && workspaceBg === undefined) return scene;
      return {
        ...scene,
        metadata: {
          ...scene.metadata,
          editor: { canvasBg, workspaceBg },
        },
      };
    },

    async list() {
      const keys = await store.keys();
      const records = await Promise.all(keys.map(read));
      return keys.flatMap((sceneKey, index) => {
        const record = records[index];
        return record ? [{ sceneKey, updatedAt: record.updatedAt ?? 0 }] : [];
      });
    },

    async remove(sceneKey) {
      await store.delete(sceneKey);
    },
  };
}
