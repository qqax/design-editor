'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { ResourceCategoryRow } from './ResourceCategoryRow';
import { ResourceDesignGrid } from './ResourceDesignGrid';
import { ResourceSearchBar } from './ResourceSearchBar';

import type {
  DesignResource,
  ResourceCategory,
  ResourceProvider,
} from '../provider';

interface ResourcePanelProps {
  provider: ResourceProvider;
  onApplyResource: (design: DesignResource) => void;
  onAddPlainText?: (preset: 'heading' | 'subheading' | 'body') => void;
  title?: string;
  placeholder: string;
  emptyMessage: string;
  errorMessage: string;
  noMatchMessage: string;
  noResourceAvailableMessage: string;
  errorLoadMoreMessage: string;
}

type Mode =
  | { kind: 'browse' }
  | { kind: 'category'; categoryId: string }
  | { kind: 'search'; query: string };

const QUICK_ADD_PRESETS: {
  label: string;
  preset: 'heading' | 'subheading' | 'body';
  fontSize: number;
  fontWeight: number;
}[] = [
  {
    label: 'Heading',
    preset: 'heading',
    fontSize: 72,
    fontWeight: 800,
  },
  {
    label: 'Subheading',
    preset: 'subheading',
    fontSize: 48,
    fontWeight: 600,
  },
  {
    label: 'Body',
    preset: 'body',
    fontSize: 28,
    fontWeight: 400,
  },
];

export function ResourcePanel({
  provider,
  onApplyResource,
  onAddPlainText,
  title,
  placeholder,
  emptyMessage,
  errorMessage,
  noMatchMessage,
  noResourceAvailableMessage,
  errorLoadMoreMessage,
}: ResourcePanelProps) {
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<Mode>({
    kind: 'browse',
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    provider
      .categories({
        signal: controller.signal,
      })
      .then((result) => {
        if (cancelled) return;

        setCategories(result);
        setLoading(false);
        setError(false);
      })
      .catch((reason: unknown) => {
        if (cancelled || (reason as { name?: string })?.name === 'AbortError') {
          return;
        }

        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [provider, reloadKey]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(false);
    setReloadKey((value) => value + 1);
  }, []);

  const handleSearchChange = useCallback((next: string) => {
    const query = next.trim();

    if (query) {
      setMode({
        kind: 'search',
        query,
      });
    } else {
      setMode({
        kind: 'browse',
      });
    }
  }, []);

  const handleSeeMore = useCallback((categoryId: string) => {
    setMode({
      kind: 'category',
      categoryId,
    });
  }, []);

  const handleBack = useCallback(() => {
    setMode({
      kind: 'browse',
    });
  }, []);

  const activeCategory =
    mode.kind === 'category'
      ? categories.find((category) => category.id === mode.categoryId)
      : undefined;

  const searchValue = mode.kind === 'search' ? mode.query : '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '12px 12px 0 12px' }}>
        {title ? (
          <h2
            style={{
              margin: '0 0 10px 0',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--de-color-text)',
            }}
          >
            {title}
          </h2>
        ) : null}

        {onAddPlainText ? (
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 4,
            }}
          >
            {QUICK_ADD_PRESETS.map(
              ({ label, preset, fontSize, fontWeight }) => (
                <button
                  key={preset}
                  onClick={() => onAddPlainText(preset)}
                  title={`Add ${label} (${fontSize}px)`}
                  type="button"
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    fontSize: 11,
                    fontWeight,
                    cursor: 'pointer',
                    background:
                      'color-mix(in srgb, var(--de-color-text) 4%, var(--de-color-surface-2))',
                    border: '1px solid var(--de-color-border)',
                    borderRadius: 6,
                    color: 'var(--de-color-text)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}

                  <span
                    style={{
                      display: 'block',
                      fontSize: 9,
                      fontWeight: 400,
                      opacity: 0.6,
                    }}
                  >
                    {fontSize}px
                  </span>
                </button>
              )
            )}
          </div>
        ) : null}
      </div>

      <ResourceSearchBar
        onChange={handleSearchChange}
        placeholder={placeholder}
        value={searchValue}
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {mode.kind === 'search' ? (
          <ResourceDesignGrid
            emptyMessage={`${noMatchMessage} "${mode.query}"`}
            errorLoadMoreMessage={errorLoadMoreMessage}
            errorMessage={errorMessage}
            onSelect={onApplyResource}
            provider={provider}
            listOpts={{
              search: mode.query,
              limit: 12,
            }}
          />
        ) : mode.kind === 'category' && activeCategory ? (
          <React.Fragment>
            <div
              style={{
                padding: '12px 12px 0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <button
                onClick={handleBack}
                type="button"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--de-color-primary)',
                }}
              >
                ← Back
              </button>

              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {activeCategory.name}
              </h3>
            </div>

            <ResourceDesignGrid
              emptyMessage={emptyMessage}
              errorLoadMoreMessage={errorLoadMoreMessage}
              errorMessage={errorMessage}
              onSelect={onApplyResource}
              provider={provider}
              listOpts={{
                categoryId: activeCategory.id,
                limit: 12,
              }}
            />
          </React.Fragment>
        ) : loading ? (
          <div style={{ padding: 16 }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: 16 }}>
            Failed to load text designs —{' '}
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
        ) : categories.length === 0 ? (
          <div
            style={{
              padding: 16,
              color: 'var(--de-color-text-muted)',
            }}
          >
            {noResourceAvailableMessage}
          </div>
        ) : (
          categories.map((category) => (
            <ResourceCategoryRow
              key={category.id}
              category={category}
              onSeeMore={handleSeeMore}
              onSelect={onApplyResource}
              provider={provider}
            />
          ))
        )}
      </div>
    </div>
  );
}
