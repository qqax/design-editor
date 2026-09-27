'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { ResourceThumbnail } from './ResourceThumbnail';
import { useMessages } from '../../../../messages';
import { MoreLink } from '../../../primitives';

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
  const m = useMessages();
  const [items, setItems] = useState<DesignResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchResources = useCallback(
    async (signal: AbortSignal) =>
      provider.list({
        categoryId: category.id,
        limit: ROW_LIMIT,
        signal,
      }),
    [provider, category.id]
  );

  const handleRetry = useCallback(() => {
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

  useEffect(() => {
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
    <div className="de-section">
      <div className="de-section-header">
        <h3 className="de-section-title">{category.name}</h3>
        <MoreLink onClick={() => onSeeMore(category.id)}>
          {m.panel.seeAll}
        </MoreLink>
      </div>

      {error ? (
        <div className="de-form-hint">
          {m.panel.loadFailed}
          <button className="de-link-btn" onClick={handleRetry} type="button">
            {m.panel.retry}
          </button>
        </div>
      ) : loading ? (
        <div className="de-resource-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className="de-resource-skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="de-form-hint">{m.panel.noResources}</div>
      ) : (
        <div className="de-resource-row scrollbar-hide">
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
