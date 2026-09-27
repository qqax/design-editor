// Created by Claude (Claude Code).
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useGallery } from '../useGallery';

import type { GalleryItem, GalleryProvider } from '../../../../../providers';

afterEach(cleanup);

const externalGallery = () => {
  let items: GalleryItem[] = [{ id: '1', url: 'https://example.com/1.png' }];
  const listeners = new Set<() => void>();
  const provider: GalleryProvider = {
    list: async () => items,
    subscribe: (onChange) => {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
  };
  const addFromWidget = (item: GalleryItem) => {
    items = [item, ...items];
    listeners.forEach((listener) => listener());
  };
  return { provider, addFromWidget };
};

describe('useGallery', () => {
  it('lists items and hides actions the provider lacks', async () => {
    const { provider } = externalGallery();
    const { result } = renderHook(() => useGallery(provider));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items.map((item) => item.id)).toEqual(['1']);
    expect(result.current.upload).toBeUndefined();
    expect(result.current.remove).toBeUndefined();
  });

  it('reloads when the provider reports an external change', async () => {
    const { provider, addFromWidget } = externalGallery();
    const { result } = renderHook(() => useGallery(provider));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => addFromWidget({ id: '2', url: 'https://example.com/2.png' }));

    await waitFor(() =>
      expect(result.current.items.map((item) => item.id)).toEqual(['2', '1'])
    );
  });

  it('reloads on refresh()', async () => {
    let items: GalleryItem[] = [];
    const provider: GalleryProvider = { list: async () => items };
    const { result } = renderHook(() => useGallery(provider));
    await waitFor(() => expect(result.current.loading).toBe(false));

    items = [{ id: '3', url: 'https://example.com/3.png' }];
    act(() => result.current.refresh());

    await waitFor(() => expect(result.current.items).toHaveLength(1));
  });
});
