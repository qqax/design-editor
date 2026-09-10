'use client';

import * as React from 'react';

import { useSceneThumbnail } from '../_shared/useSceneThumbnail';

import type { DesignTemplate } from '../../../providers';

interface Props {
  template: DesignTemplate;
  onClick: (t: DesignTemplate) => void;
}

export function TemplateThumbnail({ template, onClick }: Props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { src, loading } = useSceneThumbnail(
    {
      id: template.id,
      scene: template.scene,
      thumbnailUrl: template.thumbnailUrl,
      canvasBg: template.canvasBg,
    },
    ref
  );

  const aspectRatio =
    template.scene?.frame &&
    template.scene.frame.width &&
    template.scene.frame.height
      ? `${template.scene.frame.width} / ${template.scene.frame.height}`
      : '1 / 1';

  return (
    <button
      ref={ref}
      onClick={() => onClick(template)}
      title={template.name}
      style={{
        display: 'block',
        width: '100%',
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
          alt={template.name}
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div
          aria-label={loading ? 'Loading thumbnail' : 'No preview available'}
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
