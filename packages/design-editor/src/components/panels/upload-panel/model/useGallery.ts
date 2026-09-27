import { useCallback, useEffect, useState } from 'react';

import type { GalleryItem, GalleryProvider } from '../../../../providers';

export function useGallery(provider: GalleryProvider) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [version, setVersion] = useState(0);
  const [loadedVersion, setLoadedVersion] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    provider.list().then(
      (list) => {
        if (cancelled) return;
        setItems(list);
        setError(null);
        setLoadedVersion(version);
      },
      (err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load');
        setLoadedVersion(version);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [provider, version]);

  useEffect(() => provider.subscribe?.(refresh), [provider, refresh]);

  const upload = useCallback(
    async (file: File) => {
      if (!provider.upload) return null;
      const item = await provider.upload(file);
      refresh();
      return item;
    },
    [provider, refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await provider.remove?.(id);
      refresh();
    },
    [provider, refresh]
  );

  return {
    items,
    loading: loadedVersion === -1,
    error,
    refresh,
    upload: provider.upload ? upload : undefined,
    remove: provider.remove ? remove : undefined,
  };
}
