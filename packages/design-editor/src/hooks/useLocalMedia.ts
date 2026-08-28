import { useEffect, useState } from 'react';

const DB_NAME = 'qqax-media-db';
const STORE_NAME = 'local-media';

async function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function useLocalMedia() {
  const [media, setMedia] = useState<{ id: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        // Assume store contains { id, url, timestamp }
        const items = req.result || [];
        items.sort((a, b) => b.timestamp - a.timestamp);
        setMedia(items);
        setLoading(false);
      };
    } catch (err) {
      console.error('Failed to load local media', err);
      setLoading(false);
    }
  };

  const addMedia = async (url: string) => {
    try {
      const id = Date.now().toString() + Math.random().toString(36).slice(2);
      const item = { id, url, timestamp: Date.now() };

      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(item, id);

      tx.oncomplete = () => {
        setMedia((prev) => [item, ...prev]);
      };
    } catch (err) {
      console.error('Failed to save media', err);
    }
  };

  const removeMedia = async (id: string) => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      };
    } catch (err) {
      console.error('Failed to remove media', err);
    }
  };

  return { media, loading, addMedia, removeMedia };
}
