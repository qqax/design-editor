import React, { useRef, useState } from 'react';

import { useSceneThumbnail } from '../_shared/useSceneThumbnail';

import type { TextDesign } from '../../../providers';

// ─────────────────────────────────────────────────────────────
// TEXT DESIGN THUMB  (renders scene via useSceneThumbnail)
// ─────────────────────────────────────────────────────────────
export function TextDesignThumb({
  design,
  onClick,
}: {
  design: TextDesign;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { src, loading } = useSceneThumbnail(
    {
      id: design.id,
      scene: design.scene,
      thumbnailUrl: design.thumbnailUrl,
      canvasBg: design.canvasBg,
    },
    ref
  );
  const [hovered, setHovered] = useState(false);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type="button"
      style={{
        flexShrink: 0,
        width: 140,
        height: 140,
        borderRadius: 10,
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'color-mix(in srgb, var(--de-color-text) 5%, transparent)',
        boxShadow: hovered ? '0 0 0 2px var(--de-color-primary)' : 'none',
        transition: 'box-shadow 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {src ? (
        <img
          alt={design.name}
          draggable={false}
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />
      ) : loading ? (
        <span style={{ fontSize: 10, color: 'var(--de-color-text-muted)' }}>
          …
        </span>
      ) : (
        <span style={{ fontSize: 10, color: 'var(--de-color-text-muted)' }}>
          {design.name}
        </span>
      )}
    </button>
  );
}
