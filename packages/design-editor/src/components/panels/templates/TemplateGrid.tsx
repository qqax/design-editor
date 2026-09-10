'use client';

import * as React from 'react';

import { TemplateThumbnail } from './TemplateThumbnail';

import type {
  DesignTemplate,
  TemplateListOpts,
  TemplateProvider,
} from '../../../providers';

interface Props {
  provider: TemplateProvider;
  listOpts: TemplateListOpts;
  emptyMessage: string;
  onSelect: (t: DesignTemplate) => void;
}

export function TemplateGrid({
  provider,
  listOpts,
  emptyMessage,
  onSelect,
}: Props) {
  const [items, setItems] = React.useState<DesignTemplate[]>([]);
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
          setError('Failed to load templates');
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
      setError('Failed to load more templates');
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
            color: 'var(--de-color-primary)',
          }}
        >
          Retry
        </button>
      </div>
    );
  if (items.length === 0)
    return (
      <div style={{ padding: 16, color: 'var(--de-color-text-muted)' }}>
        {emptyMessage}
      </div>
    );

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((t) => (
          <TemplateThumbnail key={t.id} onClick={onSelect} template={t} />
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
              border: '1px solid var(--de-color-border)',
              background: 'transparent',
              color: 'var(--de-color-text)',
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
