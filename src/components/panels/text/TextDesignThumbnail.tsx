'use client';

import * as React from 'react';

import { useSceneThumbnail } from '../_shared/useSceneThumbnail';

import type { TextDesign } from '../../../providers/textDesigns';

interface Props {
  textDesign: TextDesign;
  onClick: (t: TextDesign) => void;
}

export function TextDesignThumbnail({ textDesign, onClick }: Props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { src, loading } = useSceneThumbnail(
    {
      id: textDesign.id,
      scene: textDesign.scene,
      thumbnailUrl: textDesign.thumbnailUrl,
      canvasBg: textDesign.canvasBg,
    },
    ref
  );

  const aspectRatio =
    textDesign.scene?.frame &&
    textDesign.scene.frame.width &&
    textDesign.scene.frame.height
      ? `${textDesign.scene.frame.width} / ${textDesign.scene.frame.height}`
      : '1 / 1';

  return (
    <button
      ref={ref}
      onClick={() => onClick(textDesign)}
      title={textDesign.name}
      style={{
        display: 'block',
        width: '100%',
        aspectRatio,
        border: '1px solid var(--color-border)',
        borderRadius: 6,
        overflow: 'hidden',
        padding: 0,
        background: 'var(--color-surface)',
        cursor: 'pointer',
      }}
    >
      {src ? (
        <img
          alt={textDesign.name}
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
              'linear-gradient(90deg, var(--color-surface) 0%, var(--color-bg) 50%, var(--color-surface) 100%)',
            backgroundSize: '200% 100%',
            animation: loading ? 'shimmer 1.5s infinite' : 'none',
          }}
        />
      )}
    </button>
  );
}
