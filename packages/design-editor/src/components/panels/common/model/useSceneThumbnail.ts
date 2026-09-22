'use client';

import { useEffect, useState } from 'react';

import { useEditor } from '../../../../engine';

import type { RefObject } from 'react';

import type { IScene } from '../../../../engine';

const cache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

interface UseSceneThumbnailResult {
  src: string | undefined;
  loading: boolean;
}

export function useSceneThumbnail(
  input: {
    id: string;
    scene: IScene;
    thumbnailUrl?: string;
    canvasBg?: string;
  },
  ref: RefObject<HTMLElement | HTMLButtonElement | null>,
  editorOverride?: {
    renderer?: { toDataURL: (scene: any, opts: any) => Promise<string> };
  }
): UseSceneThumbnailResult {
  const hookEditor = useEditor();
  const editor = editorOverride ?? hookEditor;

  const cached = cache.get(input.id);
  const currentSrc = input.thumbnailUrl || cached;

  const [src, setSrc] = useState<string | undefined>(currentSrc);
  const [loading, setLoading] = useState<boolean>(!currentSrc);

  const [prevId, setPrevId] = useState(input.id);
  const [prevThumbnailUrl, setPrevThumbnailUrl] = useState(input.thumbnailUrl);

  if (input.id !== prevId || input.thumbnailUrl !== prevThumbnailUrl) {
    setPrevId(input.id);
    setPrevThumbnailUrl(input.thumbnailUrl);
    setSrc(currentSrc);
    setLoading(!currentSrc);
  }

  useEffect(() => {
    if (input.thumbnailUrl || cache.has(input.id)) {
      return;
    }

    if (!ref.current || !editor?.renderer?.toDataURL) return;

    let cancelled = false;
    const observer = new IntersectionObserver(async (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (!visible) return;
      observer.disconnect();

      const existing = inFlight.get(input.id);
      if (existing) {
        setLoading(true);
        try {
          const dataUrl = await existing;
          if (!cancelled) {
            setSrc(dataUrl);
            setLoading(false);
          }
        } catch {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      setLoading(true);

      const promise = editor?.renderer?.toDataURL(input.scene, {
        format: 'image/webp',
        quality: 0.85,
        multiplier: 0.5,
        backgroundColor: input.canvasBg ?? '#ffffff',
      });

      if (!promise) return;

      inFlight.set(input.id, promise);
      try {
        const dataUrl = await promise;
        cache.set(input.id, dataUrl);
        inFlight.delete(input.id);
        if (cancelled) return;
        setSrc(dataUrl);
      } catch {
        inFlight.delete(input.id);
        if (!cancelled) setSrc(undefined);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    observer.observe(ref.current);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [input.id, input.thumbnailUrl, input.scene, input.canvasBg, editor, ref]);

  return { src, loading };
}
