'use client';

import * as React from 'react';

import { TextDesignThumbnail } from './TextDesignThumbnail';

import type {
  TextDesign,
  TextDesignListOpts,
  TextDesignProvider,
} from '../../../providers/textDesigns';

interface Props {
  provider: TextDesignProvider;
  listOpts: TextDesignListOpts;
  emptyMessage: string;
  onSelect: (t: TextDesign) => void;
}

export function TextDesignGrid({
  provider,
  listOpts,
  emptyMessage,
  onSelect,
}: Props) {
  const [items, setItems] = React.useState<TextDesign[]>([]);
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // initial / opts-changed load
  React.useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    provider
      .list({ ...listOpts, signal: ac.signal })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setCursor(res.nextCursor);
      })
      .catch((e) => {
        if (!cancelled && e?.name !== 'AbortError')
          setError('Failed to load text designs');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [provider, listOpts.categoryId, listOpts.search, listOpts.limit]);

  const loadMore = React.useCallback(async () => {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await provider.list({ ...listOpts, cursor });
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
    } catch {
      setError('Failed to load more text designs');
    } finally {
      setLoadingMore(false);
    }
  }, [provider, listOpts, cursor]);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error)
    return (
      <div style={{ padding: 16 }}>
        {error} —{' '}
        <button
          onClick={() => setItems([])}
          style={{
            all: 'unset',
            cursor: 'pointer',
            color: 'var(--color-primary)',
          }}
        >
          Retry
        </button>
      </div>
    );
  if (items.length === 0)
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)' }}>
        {emptyMessage}
      </div>
    );

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((t) => (
          <TextDesignThumbnail key={t.id} onClick={onSelect} textDesign={t} />
        ))}
      </div>
      {cursor ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}
        >
          <button
            disabled={loadingMore}
            onClick={loadMore}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
