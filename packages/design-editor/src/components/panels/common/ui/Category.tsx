// ─────────────────────────────────────────────────────────────
// CATEGORY  (mirrors StickerCategory exactly)
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { RowTile } from './RowTile';
import { ScrollRow } from './ScrollRow';

import type { ScrollRowType } from '../model';

export function Category<
  T extends ScrollRowType<CategoryT>,
  CategoryT extends string,
>({
  title,
  items,
  onAddItem,
}: {
  title: string;
  items: T[];
  onAddItem: (src: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const hasMore = items.length > 0;

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
            {expanded ? 'Less' : `More (${items.length})`}

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
          {items.map((item) => {
            return (
              <RowTile
                key={item.id}
                item={item}
                onClick={() => onAddItem(item.src)}
              />
            );
          })}
        </div>
      ) : (
        /* COLLAPSED — horizontal scroll, scrollbar hidden, with arrow hint */
        <ScrollRow items={items} onAddItem={onAddItem} />
      )}
    </div>
  );
}
