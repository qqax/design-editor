'use client';

import React, { useMemo, useState } from 'react';

import { Search } from 'lucide-react';

import { Category } from '../../common';
import { CATEGORY_ORDER, STICKERS } from '../model';

interface Props {
  onAddSticker: (src: string) => void;
}

export function StickersPanel({ onAddSticker }: Props) {
  const [search, setSearch] = useState('');

  const filteredStickers = useMemo(() => {
    if (!search.trim()) return STICKERS;
    const q = search.toLowerCase();
    return STICKERS.filter(
      (sticker) =>
        sticker.label.toLowerCase().includes(q) ||
        sticker.id.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="bg-surface flex h-full flex-col">
      {/* SEARCH */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center rounded-lg border border-[var(--de-color-border)] bg-[color-mix(in_srgb,var(--de-color-text)_5%,transparent)] px-3 py-2 transition-colors focus-within:border-[var(--de-color-primary)]">
          <Search
            className="mr-2 text-[var(--de-color-text-muted)]"
            size={14}
          />
          <input
            className="flex-1 border-none bg-transparent text-sm text-[var(--de-color-text)] outline-none"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stickers..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4 pb-6">
        {CATEGORY_ORDER.map((category) => {
          const stickers = filteredStickers
            .filter((s) => s.category === category.key)
            .map((shape) => ({
              ...shape,
              src: `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/stickers/${shape.category}/${shape.file}`,
            }));
          if (stickers.length === 0) return null;

          return (
            <Category
              key={category.key}
              items={stickers}
              onAddItem={onAddSticker}
              title={category.label}
            />
          );
        })}

        {filteredStickers.length === 0 && (
          <div className="mt-8 text-center text-sm text-[var(--de-color-text-muted)]">
            No stickers found for &#34;{search}&#34;
          </div>
        )}
      </div>
    </div>
  );
}
