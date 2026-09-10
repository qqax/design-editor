// ─────────────────────────────────────────────────────────────
// SCROLL ROW  (mirrors ScrollRow from StickersPanel 1:1)
// ─────────────────────────────────────────────────────────────

import React, { useRef, useState } from 'react';

import { ChevronRight } from 'lucide-react';

import { RowTile } from './RowTile';

import type { ScrollRowType } from '../model';

export function ScrollRow<
  T extends ScrollRowType<CategoryT>,
  CategoryT extends string,
>({ items, onAddItem }: { items: T[]; onAddItem: (src: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // Hide arrow when scrolled to the end (within 4px)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <style>{`.sticker-hscroll::-webkit-scrollbar { display: none; }`}</style>

      {/* Scroll container
          - mx-[-16px] breaks out of the parent px-4 so left edge is never clipped
          - px-[16px] restores the visual indent
          - py-[3px] gives the 2px ring room top & bottom             */}
      <div
        ref={scrollRef}
        className="sticker-hscroll -mx-4 flex gap-2 px-4 py-0.75"
        onScroll={checkScroll}
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {items.map((shape) => (
          <div
            key={shape.id}
            className="shrink-0"
            style={{
              width: 'calc((100% - 24px) / 4)',
            }}
          >
            <RowTile item={shape} onClick={() => onAddItem(shape.src)} />
          </div>
        ))}
      </div>

      {/* Right arrow — fades out when fully scrolled */}
      {canScrollRight ? (
        <button
          className="absolute top-1/2 right-0 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none outline-none"
          onClick={scrollRight}
          type="button"
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'var(--de-color-surface, #fff)',
            boxShadow: '-8px 0 14px 8px var(--de-color-surface, #fff)',
          }}
        >
          <ChevronRight
            size={14}
            style={{ color: 'var(--de-color-text-muted)' }}
          />
        </button>
      ) : null}
    </div>
  );
}
