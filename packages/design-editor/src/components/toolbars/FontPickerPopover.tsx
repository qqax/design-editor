'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ChevronDown, Upload } from 'lucide-react';

import { Input, Popover } from '../primitives';

import type { FontDescriptor, FontProvider } from '../../providers/fonts';

interface FontPickerPopoverProps {
  fontProvider: FontProvider;
  currentFamily: string | undefined;
  onChange: (family: string) => void;
}

export function FontPickerPopover({
  fontProvider,
  currentFamily,
  onChange,
}: FontPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const [fonts, setFonts] = useState<FontDescriptor[]>([]);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to provider changes (e.g. upload)
  useEffect(() => {
    if (!fontProvider.onChange) return;
    const unsub = fontProvider.onChange(() => {
      fontProvider.list().then(setFonts);
    });
    return unsub;
  }, [fontProvider]);

  // When popover opens: load list and fire-and-forget loads for previews
  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        fontProvider.list().then((list) => {
          setFonts(list);
          // Fire-and-forget: load each font for preview rendering
          list.forEach((f) => {
            fontProvider.load(f.family).catch(() => {
              /* ignore */
            });
          });
        });
      } else {
        setSearch('');
      }
    },
    [fontProvider]
  );

  const filtered = fonts.filter((f) =>
    f.family.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    async (family: string) => {
      await fontProvider.load(family).catch(() => {
        /* ignore */
      });
      onChange(family);
      setOpen(false);
      setSearch('');
    },
    [fontProvider, onChange]
  );

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        await fontProvider.upload(file);
        // onChange subscriber will refresh the list
      } catch {
        // Upload failed — silently ignore; list stays unchanged
      }
      e.target.value = '';
    },
    [fontProvider]
  );

  const trigger = (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 6,
        color: 'var(--color-text)',
        fontSize: 12,
        cursor: 'pointer',
        outline: 'none',
        fontFamily: currentFamily
          ? `'${currentFamily}', sans-serif`
          : 'inherit',
        maxWidth: 140,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {currentFamily ?? 'Default'}
      </span>
      <ChevronDown size={12} style={{ flexShrink: 0 }} />
    </button>
  );

  const popoverContent = (
    <div
      style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 0 }}
    >
      {/* Search */}
      <div style={{ padding: '8px 8px 4px' }}>
        <Input
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fonts…"
          style={{ width: '100%', fontSize: 12 }}
          value={search}
        />
      </div>

      {/* Scrollable font list */}
      <div style={{ maxHeight: 360, overflowY: 'auto', padding: '4px 0' }}>
        {filtered.map((f) => (
          <div
            key={f.family}
            onClick={async () => handleSelect(f.family)}
            onMouseEnter={(e) => {
              if (f.family !== currentFamily) {
                e.currentTarget.style.background =
                  'color-mix(in srgb, var(--color-text) 6%, var(--color-surface))';
              }
            }}
            onMouseLeave={(e) => {
              if (f.family !== currentFamily) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              background:
                f.family === currentFamily
                  ? 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))'
                  : 'transparent',
              borderLeft:
                f.family === currentFamily
                  ? '2px solid var(--color-primary)'
                  : '2px solid transparent',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: 'var(--color-text-muted)',
                fontWeight: 600,
              }}
            >
              {f.family}
              {f.source === 'custom' && (
                <span
                  style={{
                    marginLeft: 4,
                    fontSize: 9,
                    color: 'var(--color-primary)',
                  }}
                >
                  Custom
                </span>
              )}
            </span>
            <span
              style={{
                fontFamily: `'${f.family}', sans-serif`,
                fontSize: 17,
                color: 'var(--color-text)',
                lineHeight: 1.2,
              }}
            >
              Aa Bb Cc 123
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              padding: '12px',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              textAlign: 'center',
            }}
          >
            No fonts found
          </div>
        )}
      </div>

      {/* Sticky footer — Upload */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '8px',
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            padding: '7px',
            background:
              'color-mix(in srgb, var(--color-primary) 10%, transparent)',
            border:
              '1px dashed color-mix(in srgb, var(--color-primary) 35%, transparent)',
            borderRadius: 6,
            color: 'var(--color-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            fontSize: 11,
            fontWeight: 600,
            outline: 'none',
          }}
        >
          <Upload size={14} />
          Upload font
        </button>
        <input
          ref={fileInputRef}
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleUpload}
          style={{ display: 'none' }}
          type="file"
        />
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      onOpenChange={handleOpenChange}
      open={open}
      placement="top"
    >
      {trigger}
    </Popover>
  );
}
