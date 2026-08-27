import type { IScene } from '../engine';

/**
 * Plug in a persistence backend for autosave/load. The default provider stores
 * scenes in `localStorage`; you can supply a server-side adapter here.
 */
export interface PersistenceProvider {
  /** Persist the given scene under the provided key. */
  save: (sceneKey: string, scene: IScene) => Promise<void>;
  /** Load a previously saved scene, or null if none exists. */
  load: (sceneKey: string) => Promise<IScene | null>;
  /** Optional: enumerate stored scenes (used by host-app scene pickers). */
  list?: () => Promise<
    { sceneKey: string; updatedAt: number; thumbnailUrl?: string }[]
  >;
}
