'use client';

import React, { useMemo, useState } from 'react';

import { Search } from 'lucide-react';

import { Category } from './Category';
import { useMessages } from '../../../../messages';

import type { GroupedCategoryResult, ScrollRowType } from '../model';

interface Props<T extends ScrollRowType<CategoryT>, CategoryT extends string> {
  onAddItem: (src: string) => void;
  getItems: (search: string) => GroupedCategoryResult<T, CategoryT>[];
}

export function Panel<
  T extends ScrollRowType<CategoryT>,
  CategoryT extends string,
>({ onAddItem, getItems }: Props<T, CategoryT>) {
  const m = useMessages();
  const [search, setSearch] = useState('');

  const [items, totalLength] = useMemo(() => {
    const filteredItems = getItems(search);
    const innerLength = filteredItems.flatMap(
      ({ categoryItems }) => categoryItems
    ).length;
    return [filteredItems, innerLength];
  }, [getItems, search]);

  return (
    <div className="de-panel">
      <div className="de-panel-search">
        <Search size={14} />
        <input
          aria-label={m.panel.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={m.panel.searchPlaceholder}
          type="text"
          value={search}
        />
      </div>

      <div className="de-panel-body">
        {items.map(({ categoryId, categoryLabel, categoryItems }) => (
          <Category
            key={categoryId}
            items={categoryItems}
            onAddItem={onAddItem}
            title={categoryLabel}
          />
        ))}
        {totalLength === 0 && (
          <div className="de-panel-empty">{m.panel.nothingFound(search)}</div>
        )}
      </div>
    </div>
  );
}
