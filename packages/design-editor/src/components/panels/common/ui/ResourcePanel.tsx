'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { ArrowLeft } from 'lucide-react';

import { ResourceCategoryRow } from './ResourceCategoryRow';
import { ResourceDesignGrid } from './ResourceDesignGrid';
import { ResourceSearchBar } from './ResourceSearchBar';
import { useMessages } from '../../../../messages';

import type { TextPreset } from '../model';
import type {
  DesignResource,
  ResourceCategory,
  ResourceProvider,
} from '../provider';

interface ResourcePanelProps {
  provider: ResourceProvider;
  onApplyResource: (design: DesignResource) => void;
  /** Shows Heading / Subheading / Body buttons */
  onAddPlainText?: (preset: TextPreset) => void;
  placeholder: string;
  emptyMessage: string;
  errorMessage: string;
  noMatchMessage: (query: string) => string;
  noResourceAvailableMessage: string;
  errorLoadMoreMessage: string;
}

type Mode =
  | { kind: 'browse' }
  | { kind: 'category'; categoryId: string }
  | { kind: 'search'; query: string };

const QUICK_ADD_PRESETS: Omit<TextPreset, 'text'>[] = [
  { key: 'heading', fontSize: 72, fontWeight: 800 },
  { key: 'subheading', fontSize: 48, fontWeight: 600 },
  { key: 'body', fontSize: 28, fontWeight: 400 },
];

export function ResourcePanel({
  provider,
  onApplyResource,
  onAddPlainText,
  placeholder,
  emptyMessage,
  errorMessage,
  noMatchMessage,
  noResourceAvailableMessage,
  errorLoadMoreMessage,
}: ResourcePanelProps) {
  const m = useMessages();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: 'browse' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    provider
      .categories({ signal: controller.signal })
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
    setMode(query ? { kind: 'search', query } : { kind: 'browse' });
  }, []);

  const handleSeeMore = useCallback((categoryId: string) => {
    setMode({ kind: 'category', categoryId });
  }, []);

  const handleBack = useCallback(() => {
    setMode({ kind: 'browse' });
  }, []);

  const activeCategory =
    mode.kind === 'category'
      ? categories.find((category) => category.id === mode.categoryId)
      : undefined;

  const searchValue = mode.kind === 'search' ? mode.query : '';

  return (
    <div className="de-panel">
      {onAddPlainText ? (
        <div className="de-text-presets">
          {QUICK_ADD_PRESETS.map((preset) => {
            const label = m.textDesigns[preset.key];
            return (
              <button
                key={preset.key}
                className="de-text-preset"
                onClick={() => onAddPlainText({ ...preset, text: label })}
                style={{ fontWeight: preset.fontWeight }}
                title={m.textDesigns.addPreset(label, preset.fontSize)}
                type="button"
              >
                {label}
                <span>{preset.fontSize}px</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <ResourceSearchBar
        onChange={handleSearchChange}
        placeholder={placeholder}
        value={searchValue}
      />

      <div className="de-panel-body">
        {mode.kind === 'search' ? (
          <ResourceDesignGrid
            emptyMessage={noMatchMessage(mode.query)}
            errorLoadMoreMessage={errorLoadMoreMessage}
            errorMessage={errorMessage}
            listOpts={{ search: mode.query, limit: 12 }}
            onSelect={onApplyResource}
            provider={provider}
          />
        ) : mode.kind === 'category' && activeCategory ? (
          <React.Fragment>
            <div className="de-panel-subheader">
              <button
                className="de-link-btn"
                onClick={handleBack}
                type="button"
              >
                <ArrowLeft size={13} />
                {m.panel.back}
              </button>
              <span>{activeCategory.name}</span>
            </div>
            <ResourceDesignGrid
              emptyMessage={emptyMessage}
              errorLoadMoreMessage={errorLoadMoreMessage}
              errorMessage={errorMessage}
              listOpts={{ categoryId: activeCategory.id, limit: 12 }}
              onSelect={onApplyResource}
              provider={provider}
            />
          </React.Fragment>
        ) : loading ? (
          <div className="de-panel-empty">{m.panel.loading}</div>
        ) : error ? (
          <div className="de-panel-empty">
            {errorMessage}
            <button className="de-link-btn" onClick={handleRetry} type="button">
              {m.panel.retry}
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="de-panel-empty">{noResourceAvailableMessage}</div>
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
