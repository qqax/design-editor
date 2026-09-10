import { ChevronRight } from 'lucide-react';

export function ElementsSection({
  title,
  count,
  onSeeAll,
  totalOverride,
  children,
}: {
  title: string;
  count: number;
  onSeeAll: () => void;
  totalOverride?: number;
  children: React.ReactNode;
}) {
  const displayCount = totalOverride ?? count;
  return (
    <div style={{ padding: '12px 16px 0' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--de-color-text)',
          }}
        >
          {title}
        </span>
        <button
          onClick={onSeeAll}
          type="button"
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--de-color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          More ({displayCount}) <ChevronRight size={10} />
        </button>
      </div>

      {/* Horizontal scroll row */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: 4,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
