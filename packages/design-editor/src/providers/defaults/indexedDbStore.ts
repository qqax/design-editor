export interface KeyValueStore {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
  keys: () => Promise<string[]>;
  values: () => Promise<unknown[]>;
}

export const localStorageStore = (prefix = ''): KeyValueStore => ({
  get: async (key) => {
    const raw = localStorage.getItem(prefix + key);
    return raw ? (JSON.parse(raw) as unknown) : undefined;
  },
  set: async (key, value) => {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  },
  delete: async (key) => {
    localStorage.removeItem(prefix + key);
  },
  keys: async () =>
    Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
      .filter((key): key is string => !!key?.startsWith(prefix))
      .map((key) => key.slice(prefix.length)),
  values: async () =>
    Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
      .filter((key): key is string => !!key?.startsWith(prefix))
      .map((key) => JSON.parse(localStorage.getItem(key) ?? 'null') as unknown),
});

/**
 * Key-value store in an IndexedDB object store. Falls back to localStorage
 * (keys prefixed with `<dbName>/<storeName>/`) when IndexedDB is unavailable.
 */
export function createIndexedDbStore(
  dbName: string,
  storeName: string
): KeyValueStore {
  const fallback = localStorageStore(`${dbName}/${storeName}/`);
  if (typeof indexedDB === 'undefined') return fallback;

  let database: Promise<IDBDatabase> | null = null;
  const open = async () => {
    database ??= new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(storeName);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('IDB open'));
    });
    return database;
  };

  const run = async <T>(
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> => {
    const db = await open();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = action(transaction.objectStore(storeName));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('IDB transaction'));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error('IDB transaction aborted'));
    });
  };

  return {
    get: async (key) =>
      run<unknown>(
        'readonly',
        (store) => store.get(key) as IDBRequest<unknown>
      ).catch(async () => fallback.get(key)),
    set: async (key, value) =>
      run('readwrite', (store) => store.put(value, key)).then(
        () => undefined,
        async () => fallback.set(key, value)
      ),
    delete: async (key) =>
      run('readwrite', (store) => store.delete(key)).then(
        () => undefined,
        async () => fallback.delete(key)
      ),
    keys: async () =>
      run('readonly', (store) => store.getAllKeys()).then(
        (keys) => keys.map(String),
        async () => fallback.keys()
      ),
    values: async () =>
      run<unknown[]>(
        'readonly',
        (store) => store.getAll() as IDBRequest<unknown[]>
      ).catch(async () => fallback.values()),
  };
}
