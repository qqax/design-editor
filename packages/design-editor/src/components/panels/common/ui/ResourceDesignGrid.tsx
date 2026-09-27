'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { ResourceThumbnail } from './ResourceThumbnail';
import { useMessages } from '../../../../messages';

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
  const m = useMessages();
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
    return <div className="de-panel-empty">{m.panel.loading}</div>;
  }

  if (error) {
    return (
      <div className="de-panel-empty">
        {error}
        <button className="de-link-btn" onClick={handleRetry} type="button">
          {m.panel.retry}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="de-panel-empty">{emptyMessage}</div>;
  }

  return (
    <div className="de-resource-grid-wrap">
      <div className="de-resource-grid">
        {items.map((resource) => (
          <ResourceThumbnail
            key={resource.id}
            onClick={onSelect}
            resource={resource}
          />
        ))}
      </div>

      {cursor ? (
        <button
          className="de-btn"
          data-size="sm"
          data-variant="secondary"
          disabled={loadingMore}
          onClick={loadMore}
          style={{ alignSelf: 'center' }}
          type="button"
        >
          {loadingMore ? m.panel.loading : m.panel.loadMore}
        </button>
      ) : null}
    </div>
  );
}
