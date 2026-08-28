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
    async list() {
      const out: { sceneKey: string; updatedAt: number }[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          out.push({ sceneKey: key.slice(prefix.length), updatedAt: 0 });
        }
      }
      return out;
    },
  };
}
