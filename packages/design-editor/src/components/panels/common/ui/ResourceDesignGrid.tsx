'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { ResourceThumbnail } from './ResourceThumbnail';

import type {
  DesignResource,
  ResourceListOpts,
  ResourceProvider,
} from '../provider';

interface Props {
  provider: ResourceProvider;
  listOpts: ResourceListOpts;
  emptyMessage: string;
  onSelect: (resource: DesignResource) => void;
  errorMessage: string;
  errorLoadMoreMessage: string;
}

export function ResourceDesignGrid({
  provider,
  listOpts,
  emptyMessage,
  onSelect,
  errorMessage,
  errorLoadMoreMessage,
}: Props) {
  const [items, setItems] = useState<DesignResource[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    provider
      .list({
        ...listOpts,
        signal: ac.signal,
      })
      .then((res) => {
        if (cancelled) return;

        setItems(res.items);
        setCursor(res.nextCursor);
        setError(null);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled || e?.name === 'AbortError') return;

        setError(errorMessage);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [errorMessage, listOpts, provider]);

  const loadMore = React.useCallback(async () => {
    if (!cursor || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await provider.list({
        ...listOpts,
        cursor,
      });

      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setError(null);
    } catch (e) {
      if ((e as { name?: string })?.name !== 'AbortError') {
        setError(errorLoadMoreMessage);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore, provider, listOpts, errorLoadMoreMessage]);

  const handleRetry = React.useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  if (loading) {
    return <div style={{ padding: 16 }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        {error} —{' '}
        <button
          onClick={handleRetry}
          type="button"
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
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          padding: 16,
          color: 'var(--de-color-text-muted)',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {items.map((resource) => (
          <ResourceThumbnail
            key={resource.id}
            onClick={onSelect}
            resource={resource}
          />
        ))}
      </div>

      {cursor ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 12,
          }}
        >
          <button
            disabled={loadingMore}
            onClick={loadMore}
            type="button"
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--de-color-border)',
              background: 'transparent',
              color: 'var(--de-color-text)',
              cursor: loadingMore ? 'default' : 'pointer',
            }}
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
