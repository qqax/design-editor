import { Tooltip } from '../../../primitives';

import type { ScrollRowType } from '../model';

export function RowTile<
  T extends ScrollRowType<CategoryT>,
  CategoryT extends string,
>({ item, onClick }: { item: T; onClick: () => void }) {
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/x-qqax-type', 'shape');
    e.dataTransfer.setData('text/x-qqax-shape-src', item.src);
  };

  return (
    <Tooltip placement="top" title={item.label}>
      <button
        draggable
        className="de-tile"
        onClick={onClick}
        onDragStart={handleDragStart}
        style={{ aspectRatio: '1 / 1' }}
        type="button"
      >
        <img
          alt={item.label}
          className="de-tile-image"
          draggable={false}
          src={item.src}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </button>
    </Tooltip>
  );
}
