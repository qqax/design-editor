import { useState } from 'react';

import { RowTile } from './RowTile';
import { ScrollRow } from './ScrollRow';
import { useMessages } from '../../../../messages';
import { MoreLink } from '../../../primitives';

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
  const m = useMessages();
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="de-section">
      <div className="de-section-header">
        <h3 className="de-section-title">{title}</h3>
        <MoreLink expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? m.panel.showLess : m.panel.showAll(items.length)}
        </MoreLink>
      </div>

      {expanded ? (
        <div className="de-grid-3">
          {items.map((item) => (
            <RowTile
              key={item.id}
              item={item}
              onClick={() => onAddItem(item.src)}
            />
          ))}
        </div>
      ) : (
        <ScrollRow items={items} onAddItem={onAddItem} />
      )}
    </div>
  );
}
