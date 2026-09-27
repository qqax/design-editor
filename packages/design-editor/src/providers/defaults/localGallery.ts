import { createIndexedDbStore } from './indexedDbStore';

import type { GalleryItem, GalleryProvider } from '../gallery';

interface StoredItem extends GalleryItem {
  timestamp: number;
}

const isStoredItem = (value: unknown): value is StoredItem =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as StoredItem).id === 'string' &&
  typeof (value as StoredItem).url === 'string';

const readAsDataUrl = async (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

/** Gallery kept in this browser (IndexedDB), used when no provider is given. */
export function createLocalGalleryProvider(): GalleryProvider {
  const store = createIndexedDbStore('qqax-media-db', 'local-media');
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  return {
    async list() {
      const items = (await store.values()).filter(isStoredItem);
      return items
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(({ timestamp: _timestamp, ...item }) => item);
    },

    async upload(file) {
      const item: StoredItem = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
        url: await readAsDataUrl(file),
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        timestamp: Date.now(),
      };
      await store.set(item.id, item);
      notify();
      const { timestamp: _timestamp, ...galleryItem } = item;
      return galleryItem;
    },

    async remove(id) {
      await store.delete(id);
      notify();
    },

    subscribe(onChange) {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
  };
}
