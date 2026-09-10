// ─────────────────────────────────────────────────────────────
// TILE  (fluid width, aspect-ratio 1/1 — mirrors StickerTile)
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';

import { Tooltip } from '../../../primitives';

import type { ShapeDef } from '../model';

export function ShapeTile({
  shape,
  onClick,
  expanded = false,
}: {
  shape: ShapeDef;
  onClick: () => void;
  expanded?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const imageUrl = `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`;

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/x-qqax-type', 'shape');
    e.dataTransfer.setData('text/x-qqax-shape-src', imageUrl);
  };

  return (
    <Tooltip placement="top" title={shape.label}>
      <button
        draggable
        className="flex w-full shrink-0 cursor-pointer items-center justify-center rounded-xl border-none transition-all duration-200 outline-none"
        onClick={onClick}
        onDragStart={handleDragStart}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        type="button"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',

          background:
            'color-mix(in srgb, var(--de-color-text) 5%, transparent)',

          boxShadow: hovered
            ? '0 0 0 2px var(--de-color-border, #d1d5db)'
            : 'none',

          transform: hovered ? 'scale(1.03)' : 'scale(1)',
        }}
      >
        <img
          alt={shape.label}
          className="pointer-events-none h-[78%] w-[78%] object-contain transition-opacity duration-200 select-none"
          draggable={false}
          src={imageUrl}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          style={{
            opacity: hovered ? 0.85 : 1,
          }}
        />
      </button>
    </Tooltip>
  );
}
