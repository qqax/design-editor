'use client';

import * as React from 'react';

import { useMessages } from '../../../../messages';
import { useSceneThumbnail } from '../model';

import type { DesignResource } from '../provider';

interface Props {
  resource: DesignResource;
  onClick: (t: DesignResource) => void;
}

export function ResourceThumbnail({ resource, onClick }: Props) {
  const m = useMessages();
  const ref = React.useRef<HTMLButtonElement>(null);
  const { src, loading } = useSceneThumbnail(
    {
      id: resource.id,
      scene: resource.scene,
      thumbnailUrl: resource.thumbnailUrl,
      canvasBg: resource.canvasBg,
    },
    ref
  );

  const aspectRatio =
    resource.scene?.frame?.width && resource.scene.frame.height
      ? `${resource.scene.frame.width} / ${resource.scene.frame.height}`
      : '1 / 1';

  return (
    <button
      ref={ref}
      onClick={() => onClick(resource)}
      title={resource.name}
      type="button"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        aspectRatio,
        border: '1px solid var(--de-color-border)',
        borderRadius: 6,
        overflow: 'hidden',
        padding: 0,
        background: 'var(--de-color-surface)',
        cursor: 'pointer',
      }}
    >
      {src ? (
        <img
          alt={resource.name}
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : (
        <div
          aria-label={loading ? m.panel.loadingThumbnail : m.panel.noPreview}
          style={{
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, var(--de-color-surface) 0%, var(--de-color-bg) 50%, var(--de-color-surface) 100%)',
            backgroundSize: '200% 100%',
            animation: loading ? 'shimmer 1.5s infinite' : 'none',
          }}
        />
      )}
    </button>
  );
}
