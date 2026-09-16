'use client';

import * as React from 'react';

import { ResourceThumbnail } from './ResourceThumbnail';

import type {
  DesignResource,
  ResourceCategory,
  ResourceProvider,
} from '../provider';

interface Props {
  category: ResourceCategory;
  provider: ResourceProvider;
  onSelect: (resource: DesignResource) => void;
  onSeeMore: (categoryId: string) => void;
}

const ROW_LIMIT = 6;

export function ResourceCategoryRow({
  category,
  provider,
  onSelect,
  onSeeMore,
}: Props) {
  const [items, setItems] = React.useState<DesignResource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const fetchResources = React.useCallback(
    async (signal: AbortSignal) =>
      provider.list({
        categoryId: category.id,
        limit: ROW_LIMIT,
        signal,
      }),
    [provider, category.id]
  );

  const handleRetry = React.useCallback(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(false);

    fetchResources(controller.signal)
      .then((res) => {
        setItems(res.items);
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === 'AbortError') {
          return;
        }

        setError(true);
        setLoading(false);
      });
  }, [fetchResources]);

  React.useEffect(() => {
    const controller = new AbortController();

    fetchResources(controller.signal)
      .then((res) => {
        setItems(res.items);
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === 'AbortError') {
          return;
        }

        setError(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [fetchResources]);

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
          type="button"
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
        <div
          style={{
            fontSize: 12,
            color: 'var(--de-color-text-muted)',
          }}
        >
          No resources yet
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
          {items.map((resource) => (
            <ResourceThumbnail
              key={resource.id}
              onClick={onSelect}
              resource={resource}
            />
          ))}
        </div>
      )}
    </div>
  );
}
