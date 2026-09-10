'use client';

import * as React from 'react';

import { useEditor } from '../../../engine';

import type { IScene } from '../../../engine';

const cache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

interface UseSceneThumbnailResult {
  src: string | undefined;
  loading: boolean;
}

/**
 * Resolves a usable image src for a scene thumbnail. If `thumbnailUrl` is
 * provided, that wins. Otherwise, the scene is rendered via
 * `editor.renderer.toDataURL` once the element scrolls into view, and the
 * result is cached by id for the lifetime of the page.
 *
 * The third arg is for tests; in real usage we read the editor from context.
 */
export function useSceneThumbnail(
  input: {
    id: string;
    scene: IScene;
    thumbnailUrl?: string;
    canvasBg?: string;
  },
  ref: React.RefObject<HTMLElement | HTMLButtonElement | null>,
  editorOverride?: {
    renderer?: { toDataURL: (scene: any, opts: any) => Promise<string> };
  }
): UseSceneThumbnailResult {
  const hookEditor = useEditor() as any;
  const editor = editorOverride ?? hookEditor;

  const [src, setSrc] = React.useState<string | undefined>(() => {
    if (input.thumbnailUrl) return input.thumbnailUrl;
    return cache.get(input.id);
  });
  const [loading, setLoading] = React.useState<boolean>(
    () => !src && !input.thumbnailUrl
  );

  React.useEffect(() => {
    if (input.thumbnailUrl) {
      setSrc(input.thumbnailUrl);
      setLoading(false);
      return;
    }
    const cached = cache.get(input.id);
    if (cached) {
      setSrc(cached);
      setLoading(false);
      return;
    }
    if (!ref.current || !editor?.renderer?.toDataURL) return;

    let cancelled = false;
    const observer = new IntersectionObserver(async (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (!visible) return;
      observer.disconnect();

      // Deduplicate concurrent renders for the same id
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
      const promise = editor.renderer.toDataURL(input.scene, {
        format: 'png',
        quality: 0.85,
        multiplier: 0.5,
        backgroundColor: input.canvasBg ?? '#ffffff',
      });
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
