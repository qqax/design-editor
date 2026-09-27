import type { CanvasBackground, IScene } from '../engine';
import type { PersistenceProvider } from '../providers';

/** x, y: scene point at the canvas centre, relative to the frame centre */
export interface AutosaveViewport {
  zoom: number;
  x: number;
  y: number;
}

export interface AutosavePayload {
  scene: IScene;
  canvasBg?: CanvasBackground;
  workspaceBg?: string;
  viewport?: AutosaveViewport;
}

interface EditorMetadata {
  canvasBg?: CanvasBackground;
  workspaceBg?: string;
}

const readJson = (raw: string | null): unknown => {
  try {
    return raw ? (JSON.parse(raw) as unknown) : undefined;
  } catch {
    return undefined;
  }
};

const isPayload = (value: unknown): value is AutosavePayload =>
  typeof value === 'object' && value !== null && 'scene' in value;

const withEditorMetadata = (
  scene: IScene,
  { canvasBg, workspaceBg }: EditorMetadata
): IScene => ({
  ...scene,
  metadata: { ...scene.metadata, editor: { canvasBg, workspaceBg } },
});

/**
 * Scenes go through the persistence provider, with the editor's backgrounds
 * in `scene.metadata.editor`. The viewport stays in localStorage: it is
 * written on `pagehide`, where an asynchronous write may not complete.
 */
export function createAutosaveStore(provider: PersistenceProvider) {
  const viewportKey = (key: string) => `${key}:viewport`;

  const saveViewport = (key: string, viewport: AutosaveViewport) => {
    try {
      localStorage.setItem(viewportKey(key), JSON.stringify(viewport));
    } catch {
      /* storage full or unavailable */
    }
  };

  return {
    async load(key: string): Promise<AutosavePayload | null> {
      let scene = await provider.load(key);
      if (!scene) {
        const legacy = readJson(localStorage.getItem(key));
        if (!isPayload(legacy)) return null;
        scene = withEditorMetadata(legacy.scene, legacy);
        await provider.save(key, scene);
        localStorage.removeItem(key);
      }
      const { canvasBg, workspaceBg } = (scene.metadata.editor ??
        {}) as EditorMetadata;
      const viewport = readJson(localStorage.getItem(viewportKey(key)));
      return {
        scene,
        ...(canvasBg !== undefined && { canvasBg }),
        ...(workspaceBg !== undefined && { workspaceBg }),
        ...(viewport ? { viewport: viewport as AutosaveViewport } : {}),
      };
    },

    async save(key: string, payload: AutosavePayload): Promise<void> {
      const { scene, viewport } = payload;
      if (viewport) saveViewport(key, viewport);
      await provider.save(key, withEditorMetadata(scene, payload));
    },

    saveViewport,

    async clear(key: string): Promise<void> {
      localStorage.removeItem(viewportKey(key));
      localStorage.removeItem(key);
      await provider.remove?.(key);
    },
  };
}
