'use client';

import React, { useEffect, useState } from 'react';

import { ElementsSection } from './ElementsSection';
import { TextDesignThumb } from './TextDesignThumb';
import { SHAPES } from '../shapes-panel';
import { STICKERS } from '../stickers-panel';
import { ImageThumb } from './ImageThumb';
import { PlaceholderThumb } from './PlaceholderThumb';

import type { TextDesign, TextDesignProvider } from '../../../providers';

interface ElementsPanelProps {
  textDesignProvider: TextDesignProvider;
  onApplyTextDesign: (design: TextDesign) => void;
  onAddShape: (shape: string) => void;
  onAddSticker: (sticker: string) => void;
  onSeeAll: (panel: 'text' | 'shapes' | 'stickers') => void;
}

// ─────────────────────────────────────────────────────────────
// MAIN PANEL
// ─────────────────────────────────────────────────────────────

export function ElementsPanel({
  textDesignProvider,
  onApplyTextDesign,
  onAddShape,
  onAddSticker,
  onSeeAll,
}: ElementsPanelProps) {
  const [textDesigns, setTextDesigns] = useState<TextDesign[]>([]);

  useEffect(() => {
    textDesignProvider
      .list({ limit: 6 })
      .then((result) => {
        setTextDesigns(result.items);
      })
      .catch(() => {
        /* ignore */
      });
  }, [textDesignProvider]);

  // First 6 shapes & stickers
  const previewShapes = SHAPES.slice(0, 6);
  const previewStickers = STICKERS.slice(0, 6);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        padding: '8px 0 24px',
      }}
    >
      {/* TEXT DESIGNS */}
      <ElementsSection
        onSeeAll={() => onSeeAll('text')}
        title="Text"
        totalOverride={textDesigns.length > 0 ? undefined : undefined}
        count={
          SHAPES.length /* placeholder; text provider total unknown without extra call */
        }
      >
        {textDesigns.map((design) => (
          <TextDesignThumb
            key={design.id}
            design={design}
            onClick={() => onApplyTextDesign(design)}
          />
        ))}
        {textDesigns.length === 0 && <PlaceholderThumb label="Text" />}
      </ElementsSection>

      {/* SHAPES */}
      <ElementsSection
        count={SHAPES.length}
        onSeeAll={() => onSeeAll('shapes')}
        title="Shapes"
      >
        {previewShapes.map((shape) => {
          const src = `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`;
          return (
            <ImageThumb
              key={shape.id}
              label={shape.label}
              onClick={() => onAddShape(src)}
              src={src}
            />
          );
        })}
      </ElementsSection>

      {/* STICKERS */}
      <ElementsSection
        count={STICKERS.length}
        onSeeAll={() => onSeeAll('stickers')}
        title="Stickers"
      >
        {previewStickers.map((sticker) => {
          const src = `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/stickers/${sticker.category}/${sticker.file}`;
          return (
            <ImageThumb
              key={sticker.id}
              label={sticker.label}
              onClick={() => onAddSticker(src)}
              src={src}
            />
          );
        })}
      </ElementsSection>
    </div>
  );
}
