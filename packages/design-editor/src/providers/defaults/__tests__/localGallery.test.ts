// Created by Claude (Claude Code).
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createLocalGalleryProvider } from '../localGallery';

beforeEach(() => localStorage.clear());

describe('createLocalGalleryProvider (localStorage fallback in jsdom)', () => {
  it('uploads, lists newest first, notifies and removes', async () => {
    const gallery = createLocalGalleryProvider();
    const onChange = vi.fn();
    const unsubscribe = gallery.subscribe?.(onChange);

    const first = await gallery.upload!(
      new File(['a'], 'a.png', { type: 'image/png' })
    );
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = await gallery.upload!(
      new File(['b'], 'b.mp4', { type: 'video/mp4' })
    );

    expect(first.url.startsWith('data:image/png')).toBe(true);
    expect(second.type).toBe('video');
    expect((await gallery.list()).map((item) => item.name)).toEqual([
      'b.mp4',
      'a.png',
    ]);
    expect(onChange).toHaveBeenCalledTimes(2);

    await gallery.remove!(first.id);
    expect((await gallery.list()).map((item) => item.id)).toEqual([second.id]);

    unsubscribe?.();
    await gallery.remove!(second.id);
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
