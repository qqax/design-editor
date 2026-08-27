'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useSceneThumbnail } from './_shared/useSceneThumbnail'
import { SHAPES } from './ShapesPanel'
import { STICKERS } from './StickersPanel'
import type { TextDesign, TextDesignProvider } from '../../providers/textDesigns'

// ─────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────

interface ElementsPanelProps {
  textDesignProvider: TextDesignProvider
  onApplyTextDesign: (design: TextDesign) => void
  onAddShape: (shape: string) => void
  onAddSticker: (sticker: string) => void
  onSeeAll: (panel: 'text' | 'shapes' | 'stickers') => void
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
  const [textDesigns, setTextDesigns] = useState<TextDesign[]>([])

  useEffect(() => {
    textDesignProvider.list({ limit: 6 }).then(result => {
      setTextDesigns(result.items)
    }).catch(() => {/* ignore */})
  }, [textDesignProvider])

  // First 6 shapes & stickers
  const previewShapes = SHAPES.slice(0, 6)
  const previewStickers = STICKERS.slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '8px 0 24px' }}>
      {/* TEXT DESIGNS */}
      <Section
        title="Text"
        count={SHAPES.length /* placeholder; text provider total unknown without extra call */}
        onSeeAll={() => onSeeAll('text')}
        totalOverride={textDesigns.length > 0 ? undefined : undefined}
      >
        {textDesigns.map(design => (
          <TextDesignThumb key={design.id} design={design} onClick={() => onApplyTextDesign(design)} />
        ))}
        {textDesigns.length === 0 && (
          <PlaceholderThumb label="Text" />
        )}
      </Section>

      {/* SHAPES */}
      <Section title="Shapes" count={SHAPES.length} onSeeAll={() => onSeeAll('shapes')}>
        {previewShapes.map(shape => {
          const src = `https://cdn.jsdelivr.net/gh/fastlabai/design-editor/assets/shapes/${shape.category}/${shape.file}`
          return (
            <ImageThumb key={shape.id} src={src} label={shape.label} onClick={() => onAddShape(src)} />
          )
        })}
      </Section>

      {/* STICKERS */}
      <Section title="Stickers" count={STICKERS.length} onSeeAll={() => onSeeAll('stickers')}>
        {previewStickers.map(sticker => {
          const src = `https://cdn.jsdelivr.net/gh/fastlabai/design-editor/assets/stickers/${sticker.category}/${sticker.file}`
          return (
            <ImageThumb key={sticker.id} src={src} label={sticker.label} onClick={() => onAddSticker(src)} />
          )
        })}
      </Section>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────

function Section({
  title,
  count,
  onSeeAll,
  totalOverride,
  children,
}: {
  title: string
  count: number
  onSeeAll: () => void
  totalOverride?: number
  children: React.ReactNode
}) {
  const displayCount = totalOverride ?? count
  return (
    <div style={{ padding: '12px 16px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{title}</span>
        <button
          onClick={onSeeAll}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          More ({displayCount}) <ChevronRight size={10} />
        </button>
      </div>

      {/* Horizontal scroll row */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: 4,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TEXT DESIGN THUMB  (renders scene via useSceneThumbnail)
// ─────────────────────────────────────────────────────────────

function TextDesignThumb({ design, onClick }: { design: TextDesign; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null!)
  const { src, loading } = useSceneThumbnail(
    { id: design.id, scene: design.scene, thumbnailUrl: design.thumbnailUrl, canvasBg: design.canvasBg },
    ref as React.RefObject<HTMLElement>,
  )
  const [hovered, setHovered] = useState(false)

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 140,
        height: 140,
        borderRadius: 10,
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
        boxShadow: hovered ? '0 0 0 2px var(--color-primary)' : 'none',
        transition: 'box-shadow 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={design.name}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
      ) : loading ? (
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>…</span>
      ) : (
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{design.name}</span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// IMAGE THUMB  (shapes / stickers)
// ─────────────────────────────────────────────────────────────

function ImageThumb({ src, label, onClick }: { src: string; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 140,
        height: 140,
        borderRadius: 10,
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
        boxShadow: hovered ? '0 0 0 2px var(--color-primary)' : 'none',
        transition: 'box-shadow 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={src}
        alt={label}
        draggable={false}
        style={{ width: '78%', height: '78%', objectFit: 'contain', pointerEvents: 'none' }}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// PLACEHOLDER THUMB  (used when text designs are loading / empty)
// ─────────────────────────────────────────────────────────────

function PlaceholderThumb({ label }: { label: string }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 140,
        height: 140,
        borderRadius: 10,
        background: 'color-mix(in srgb, var(--color-text) 4%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        color: 'var(--color-text-muted)',
      }}
    >
      {label}
    </div>
  )
}
