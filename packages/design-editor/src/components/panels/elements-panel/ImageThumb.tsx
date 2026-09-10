// ─────────────────────────────────────────────────────────────
// IMAGE THUMB  (shapes / stickers)
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';

export function ImageThumb({
  src,
  label,
  onClick,
}: {
  src: string;
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
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
      <img
        alt={label}
        draggable={false}
        src={src}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
        style={{
          width: '78%',
          height: '78%',
          objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />
    </button>
  );
}
