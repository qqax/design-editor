import type { CanvasBackground, IScene } from '../engine';

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

export interface KeyValueBackend {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

const DB_NAME = 'design-editor';
const STORE_NAME = 'autosave';

export const localStorageBackend: KeyValueBackend = {
  get: async (key) => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : undefined;
  },
  set: async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  delete: async (key) => {
    localStorage.removeItem(key);
  },
};

/** IndexedDB store; falls back to localStorage when IndexedDB is unavailable. */
export function indexedDbBackend(): KeyValueBackend {
  let database: Promise<IDBDatabase> | null = null;

  const open = async () => {
    database ??= new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('IDB open'));
    });
    return database;
  };

  const run = async <T>(
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>
  ) =>
    open().then(
      async (db) =>
        new Promise<T>((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, mode);
          const request = action(transaction.objectStore(STORE_NAME));
          transaction.oncomplete = () => resolve(request.result);
          transaction.onerror = () =>
            reject(transaction.error ?? new Error('IDB transaction'));
          transaction.onabort = () =>
            reject(transaction.error ?? new Error('IDB transaction aborted'));
        })
    );

  const available = typeof indexedDB !== 'undefined';

  return {
    get: async (key) =>
      available
        ? run<unknown>(
            'readonly',
            (store) => store.get(key) as IDBRequest<unknown>
          ).catch(async () => localStorageBackend.get(key))
        : localStorageBackend.get(key),
    set: async (key, value) =>
      available
        ? run('readwrite', (store) => store.put(value, key)).then(
            () => undefined,
            async () => localStorageBackend.set(key, value)
          )
        : localStorageBackend.set(key, value),
    delete: async (key) =>
      available
        ? run('readwrite', (store) => store.delete(key)).then(
            () => undefined,
            async () => localStorageBackend.delete(key)
          )
        : localStorageBackend.delete(key),
  };
}

const isPayload = (value: unknown): value is AutosavePayload =>
  typeof value === 'object' && value !== null && 'scene' in value;

const readJson = (raw: string | null): unknown => {
  try {
    return raw ? (JSON.parse(raw) as unknown) : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Scenes go to `backend`. The viewport stays in localStorage: it is written on
 * `pagehide`, where an asynchronous IndexedDB transaction may not complete.
 */
export function createAutosaveStore(backend: KeyValueBackend) {
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
      let payload = await backend.get(key);
      if (!isPayload(payload)) {
        const legacy = readJson(localStorage.getItem(key));
        if (!isPayload(legacy)) return null;
        payload = legacy;
        await backend.set(key, legacy);
        if (backend !== localStorageBackend) localStorage.removeItem(key);
      }
      const saved = payload as AutosavePayload;
      const viewport = readJson(localStorage.getItem(viewportKey(key)));
      return viewport
        ? { ...saved, viewport: viewport as AutosaveViewport }
        : saved;
    },

    async save(key: string, payload: AutosavePayload): Promise<void> {
      const { viewport, ...rest } = payload;
      if (viewport) saveViewport(key, viewport);
      await backend.set(key, rest);
    },

    saveViewport,

    async clear(key: string): Promise<void> {
      localStorage.removeItem(viewportKey(key));
      localStorage.removeItem(key);
      await backend.delete(key);
    },
  };
}

export const autosaveStore = createAutosaveStore(indexedDbBackend());
