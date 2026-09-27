import React, { useRef, useState } from 'react';

import { ChevronRight } from 'lucide-react';

import { RowTile } from './RowTile';
import { useMessages } from '../../../../messages';

import type { ScrollRowType } from '../model';

export function ScrollRow<
  T extends ScrollRowType<CategoryT>,
  CategoryT extends string,
>({ items, onAddItem }: { items: T[]; onAddItem: (src: string) => void }) {
  const m = useMessages();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  return (
    <div className="de-scroll-row">
      <div
        ref={scrollRef}
        className="de-scroll-row-track scrollbar-hide"
        onScroll={checkScroll}
      >
        {items.map((shape) => (
          <div
            key={shape.id}
            className="de-scroll-row-item"
            style={{ width: 'calc((100% - 24px) / 4)' }}
          >
            <RowTile item={shape} onClick={() => onAddItem(shape.src)} />
          </div>
        ))}
      </div>

      {canScrollRight ? (
        <button
          aria-label={m.panel.scrollRight}
          className="de-scroll-row-next"
          type="button"
          onClick={() =>
            scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })
          }
        >
          <ChevronRight size={14} />
        </button>
      ) : null}
    </div>
  );
}
