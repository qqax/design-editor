// ─────────────────────────────────────────────────────────────
// CATEGORY  (mirrors StickerCategory exactly)
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { ScrollRow } from './ScrollRow';
import { ShapeTile } from './ShapeTile';

import type { ShapeDef } from '../model';

export function ShapeCategory({
  title,
  shapes,
  onAddShape,
}: {
  title: string;
  shapes: ShapeDef[];
  onAddShape: (src: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (shapes.length === 0) return null;

  const hasMore = shapes.length > 0;

  return (
    <div className="mt-5">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-tight text-[var(--de-color-text)]">
          {title}
        </h3>

        {hasMore ? (
          <button
            className="flex cursor-pointer items-center border-none bg-transparent text-xs font-semibold text-[var(--de-color-text-muted)] transition-colors hover:text-[var(--de-color-primary)]"
            onClick={() => setExpanded(!expanded)}
            type="button"
          >
            {expanded ? 'Less' : `More (${shapes.length})`}

            {expanded ? (
              <ChevronUp className="ml-1" size={10} />
            ) : (
              <ChevronDown className="ml-1" size={10} />
            )}
          </button>
        ) : null}
      </div>

      {expanded ? (
        /* EXPANDED — 3-col grid */
        <div className="mt-1 grid auto-rows-fr grid-cols-3 gap-2">
          {shapes.map((shape) => (
            <ShapeTile
              key={shape.id}
              shape={shape}
              onClick={() =>
                onAddShape(
                  `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`
                )
              }
            />
          ))}
        </div>
      ) : (
        /* COLLAPSED — horizontal scroll, scrollbar hidden, with arrow hint */
        <ScrollRow onAddShape={onAddShape} shapes={shapes} />
      )}
    </div>
  );
}
