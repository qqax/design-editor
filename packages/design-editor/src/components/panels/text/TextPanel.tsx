'use client';

import * as React from 'react';

import { TextDesignCategoryRow } from './TextDesignCategoryRow';
import { TextDesignGrid } from './TextDesignGrid';
import { TextDesignSearchBar } from './TextDesignSearchBar';

import type {
  TextDesign,
  TextDesignCategory,
  TextDesignProvider,
} from '../../../providers';

interface TextPanelProps {
  provider: TextDesignProvider;
  onApplyTextDesign: (design: TextDesign) => void;
  onAddPlainText?: (preset: 'heading' | 'subheading' | 'body') => void;
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
  { label: 'Heading', preset: 'heading', fontSize: 72, fontWeight: 800 },
  { label: 'Subheading', preset: 'subheading', fontSize: 48, fontWeight: 600 },
  { label: 'Body', preset: 'body', fontSize: 28, fontWeight: 400 },
];

export function TextPanel({
  provider,
  onApplyTextDesign,
  onAddPlainText,
}: TextPanelProps) {
  const [categories, setCategories] = React.useState<TextDesignCategory[]>([]);
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
      {/* Panel header */}
      <div style={{ padding: '12px 12px 0 12px' }}>
        <h2
          style={{
            margin: '0 0 10px 0',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--de-color-text)',
          }}
        >
          Text Designs
        </h2>
        {/* Quick add row */}
        {onAddPlainText ? (
          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
            {QUICK_ADD_PRESETS.map(
              ({ label, preset, fontSize, fontWeight }) => (
                <button
                  key={preset}
                  onClick={() => onAddPlainText(preset)}
                  title={`Add ${label} (${fontSize}px)`}
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
      <TextDesignSearchBar onChange={handleSearchChange} value={search} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {mode.kind === 'search' ? (
          <TextDesignGrid
            emptyMessage={`No text designs match "${mode.query}"`}
            listOpts={{ search: mode.query, limit: 12 }}
            onSelect={onApplyTextDesign}
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
                  color: 'var(--de-color-primary)',
                }}
              >
                ← Back
              </button>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                {activeCategory.name}
              </h3>
            </div>
            <TextDesignGrid
              emptyMessage="No text designs in this category"
              listOpts={{ categoryId: activeCategory.id, limit: 12 }}
              onSelect={onApplyTextDesign}
              provider={provider}
            />
          </React.Fragment>
        ) : loading ? (
          <div style={{ padding: 16 }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: 16 }}>
            Failed to load text designs —{' '}
            <button
              onClick={loadCategories}
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
          <div style={{ padding: 16, color: 'var(--de-color-text-muted)' }}>
            No text designs available. Host apps can supply a
            textDesignProvider.
          </div>
        ) : (
          categories.map((c) => (
            <TextDesignCategoryRow
              key={c.id}
              category={c}
              onSeeMore={handleSeeMore}
              onSelect={onApplyTextDesign}
              provider={provider}
            />
          ))
        )}
      </div>
    </div>
  );
}
