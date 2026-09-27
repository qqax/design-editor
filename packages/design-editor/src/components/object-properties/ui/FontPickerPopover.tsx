'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ChevronDown, Upload } from 'lucide-react';

import { useEditor } from '../../../engine';
import { useMessages } from '../../../messages';
import { useEditorContext } from '../../EditorContext';
import { Input, Popover } from '../../primitives';

import type { FontDescriptor } from '../../../providers';

interface FontPickerPopoverProps {
  currentFamily: string | undefined;
  onChange: (family: string) => void;
}

export function FontPickerPopover({
  currentFamily,
  onChange,
}: FontPickerPopoverProps) {
  const m = useMessages().text;
  const [open, setOpen] = useState(false);
  const [fonts, setFonts] = useState<FontDescriptor[]>([]);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fontProvider } = useEditorContext();
  const editorFonts = useEditor()?.fonts;

  // Subscribe to provider changes (e.g. upload)
  useEffect(() => {
    if (!fontProvider.onChange) return;
    return fontProvider.onChange(() => {
      void fontProvider.list().then(setFonts);
    });
  }, [fontProvider]);

  // When popover opens: load list and fire-and-forget loads for previews
  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        void fontProvider.list().then((list) => {
          setFonts(list);
          // Fire-and-forget: load each font for preview rendering
          list.forEach((f) => {
            void editorFonts?.ensureFamily(f.family);
          });
        });
      } else {
        setSearch('');
      }
    },
    [fontProvider, editorFonts]
  );

  const filtered = fonts.filter((f) =>
    f.family.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    async (family: string) => {
      await editorFonts?.ensureFamily(family);
      onChange(family);
      setOpen(false);
      setSearch('');
    },
    [onChange, editorFonts]
  );

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const uploaded = await fontProvider.upload(file);
        // Drop any cached miss from before this face existed.
        editorFonts?.invalidate(uploaded.family);
        // onChange subscriber will refresh the list
      } catch {
        // Upload failed — silently ignore; list stays unchanged
      }
      e.target.value = '';
    },
    [fontProvider, editorFonts]
  );

  const trigger = (
    <button
      aria-label={m.font}
      className="de-font-trigger"
      title={m.font}
      type="button"
      style={{
        fontFamily: currentFamily
          ? `'${currentFamily}', sans-serif`
          : undefined,
      }}
    >
      <span>{currentFamily ?? m.defaultFont}</span>
      <ChevronDown size={12} />
    </button>
  );

  const popoverContent = (
    <div className="de-font-picker">
      <div className="de-font-search">
        <Input
          autoFocus
          aria-label={m.searchFonts}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={m.searchFonts}
          value={search}
        />
      </div>

      <div className="de-font-list">
        {filtered.map((f) => (
          <button
            key={f.family}
            aria-pressed={f.family === currentFamily}
            className="de-font-item"
            onClick={async () => handleSelect(f.family)}
            type="button"
          >
            <span className="de-font-name">
              {f.family}
              {f.source === 'custom' ? (
                <span className="de-font-badge">{m.customFont}</span>
              ) : null}
            </span>
            <span
              className="de-font-sample"
              style={{ fontFamily: `'${f.family}', sans-serif` }}
            >
              {m.fontSample}
            </span>
          </button>
        ))}
        {filtered.length === 0 ? (
          <div className="de-panel-empty">{m.noFonts}</div>
        ) : null}
      </div>

      <div className="de-font-footer">
        <button
          className="de-gallery-upload de-font-upload"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Upload size={14} />
          {m.uploadFont}
        </button>
        <input
          ref={fileInputRef}
          hidden
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleUpload}
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
