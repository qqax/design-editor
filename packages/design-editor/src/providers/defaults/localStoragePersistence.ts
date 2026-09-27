import type { IScene } from '../../engine';
import type { PersistenceProvider } from '../persistence';

export function createLocalStoragePersistence(
  opts: { prefix?: string } = {}
): PersistenceProvider {
  const prefix = opts.prefix ?? 'design_editor_scene_';
  return {
    async save(sceneKey, scene) {
      localStorage.setItem(prefix + sceneKey, JSON.stringify(scene));
    },
    async load(sceneKey) {
      const raw = localStorage.getItem(prefix + sceneKey);
      return raw ? (JSON.parse(raw) as IScene) : null;
    },
    async remove(sceneKey) {
      localStorage.removeItem(prefix + sceneKey);
    },
    async list() {
      return Array.from({ length: localStorage.length }, (_, i) =>
        localStorage.key(i)
      )
        .filter((key): key is string => !!key?.startsWith(prefix))
        .map((key) => ({ sceneKey: key.slice(prefix.length), updatedAt: 0 }));
    },
  };
}
