'use client';

import * as React from 'react';

import { TextDesignThumbnail } from './TextDesignThumbnail';

import type {
  TextDesign,
  TextDesignCategory,
  TextDesignProvider,
} from '../../../providers';

interface Props {
  category: TextDesignCategory;
  provider: TextDesignProvider;
  onSelect: (t: TextDesign) => void;
  onSeeMore: (categoryId: string) => void;
}

const ROW_LIMIT = 6;

export function TextDesignCategoryRow({
  category,
  provider,
  onSelect,
  onSeeMore,
}: Props) {
  const [items, setItems] = React.useState<TextDesign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const load = React.useCallback(() => {
    let cancelled = false;
    const ac = new AbortController();
    setLoading(true);
    setError(false);
    provider
      .list({ categoryId: category.id, limit: ROW_LIMIT, signal: ac.signal })
      .then((res) => {
        if (!cancelled) {
          setItems(res.items);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled && e?.name !== 'AbortError') {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [provider, category.id]);

  React.useEffect(() => {
    return load();
  }, [load]);

  return (
    <div style={{ padding: '12px 12px 4px 12px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 8,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--de-color-text)',
          }}
        >
          {category.name}
        </h3>
        <button
          onClick={() => onSeeMore(category.id)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--de-color-primary)',
          }}
        >
          See more
        </button>
      </div>
      {error ? (
        <div style={{ fontSize: 12 }}>
          Failed to load —{' '}
          <button
            onClick={load}
            style={{
              all: 'unset',
              cursor: 'pointer',
              color: 'var(--de-color-primary)',
            }}
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: '0 0 130px',
                aspectRatio: '1 / 1',
                background: 'var(--de-color-surface)',
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--de-color-text-muted)' }}>
          No text designs yet
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: '130px',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
          }}
        >
          {items.map((t) => (
            <TextDesignThumbnail key={t.id} onClick={onSelect} textDesign={t} />
          ))}
        </div>
      )}
    </div>
  );
}
