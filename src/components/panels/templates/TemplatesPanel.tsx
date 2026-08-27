'use client';

import * as React from 'react';

import { TemplateCategoryRow } from './TemplateCategoryRow';
import { TemplateGrid } from './TemplateGrid';
import { TemplateSearchBar } from './TemplateSearchBar';

import type {
  DesignTemplate,
  TemplateCategory,
  TemplateProvider,
} from '../../../providers/templates';

interface Props {
  provider: TemplateProvider;
  onApplyTemplate: (t: DesignTemplate) => void;
}

type Mode =
  | { kind: 'browse' }
  | { kind: 'category'; categoryId: string }
  | { kind: 'search'; query: string };

export function TemplatesPanel({ provider, onApplyTemplate }: Props) {
  const [categories, setCategories] = React.useState<TemplateCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [mode, setMode] = React.useState<Mode>({ kind: 'browse' });

  const loadCategories = React.useCallback(() => {
    let cancelled = false;
    const ac = new AbortController();
    setLoading(true);
    setError(false);
    provider
      .categories({ signal: ac.signal })
      .then((cats) => {
        if (!cancelled) {
          setCategories(cats);
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
  }, [provider]);

  React.useEffect(() => loadCategories(), [loadCategories]);

  // search bar drives mode
  const handleSearchChange = React.useCallback((next: string) => {
    setSearch(next);
    if (next.trim()) {
      setMode({ kind: 'search', query: next.trim() });
    } else {
      setMode({ kind: 'browse' });
    }
  }, []);

  const handleSeeMore = React.useCallback((categoryId: string) => {
    setMode({ kind: 'category', categoryId });
  }, []);

  const handleBack = React.useCallback(() => {
    setMode({ kind: 'browse' });
  }, []);

  const activeCategory =
    mode.kind === 'category'
      ? categories.find((c) => c.id === mode.categoryId)
      : undefined;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <TemplateSearchBar onChange={handleSearchChange} value={search} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {mode.kind === 'search' ? (
          <TemplateGrid
            emptyMessage={`No templates match "${mode.query}"`}
            listOpts={{ search: mode.query, limit: 12 }}
            onSelect={onApplyTemplate}
            provider={provider}
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
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--color-primary)',
                }}
              >
                ← Back
              </button>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                {activeCategory.name}
              </h3>
            </div>
            <TemplateGrid
              emptyMessage="No templates in this category"
              listOpts={{ categoryId: activeCategory.id, limit: 12 }}
              onSelect={onApplyTemplate}
              provider={provider}
            />
          </React.Fragment>
        ) : loading ? (
          <div style={{ padding: 16 }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: 16 }}>
            Failed to load templates —{' '}
            <button
              onClick={loadCategories}
              style={{
                all: 'unset',
                cursor: 'pointer',
                color: 'var(--color-primary)',
              }}
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: 16, color: 'var(--color-text-muted)' }}>
            No templates available. Host apps can supply a templateProvider.
          </div>
        ) : (
          categories.map((c) => (
            <TemplateCategoryRow
              key={c.id}
              category={c}
              onSeeMore={handleSeeMore}
              onSelect={onApplyTemplate}
              provider={provider}
            />
          ))
        )}
      </div>
    </div>
  );
}
