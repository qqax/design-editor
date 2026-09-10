'use client';

import React, { useMemo, useState } from 'react';

import { Search } from 'lucide-react';

import { Category } from './Category';

import type { GroupedCategoryResult, ScrollRowType } from '../model';

interface Props<T extends ScrollRowType<CategoryT>, CategoryT extends string> {
  onAddItem: (src: string) => void;
  getItems: (search: string) => GroupedCategoryResult<T, CategoryT>[];
}

export function Panel<
  T extends ScrollRowType<CategoryT>,
  CategoryT extends string,
>({ onAddItem, getItems }: Props<T, CategoryT>) {
  const [search, setSearch] = useState('');

  const [items, totalLength] = useMemo(() => {
    const filteredItems = getItems(search);
    const innerLength = filteredItems.flatMap(
      ({ categoryItems }) => categoryItems
    ).length;
    return [filteredItems, innerLength];
  }, [getItems, search]);

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
            placeholder="Search shapes..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4 pb-6">
        {items.map(({ categoryId, categoryLabel, categoryItems }) => (
          <Category
            key={categoryId}
            items={categoryItems}
            onAddItem={onAddItem}
            title={categoryLabel}
          />
        ))}

        {totalLength === 0 && (
          <div className="mt-8 text-center text-sm text-[var(--de-color-text-muted)]">
            No shapes found for &#34;{search}&#34;
          </div>
        )}
      </div>
    </div>
  );
}
