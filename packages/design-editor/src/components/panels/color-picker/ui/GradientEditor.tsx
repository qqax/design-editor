'use client';

import React from 'react';

import { Plus, X } from 'lucide-react';

import { gradientToCss } from '../../../../engine';

import type { GradientFill, GradientStop } from '../../../../engine';

interface GradientEditorProps {
  gradient: GradientFill;
  onChange: (gradient: GradientFill) => void;
}

const LABEL: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--de-color-text-muted)',
};

const ICON_BTN: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: 6,
  border: '1px solid var(--de-color-border)',
  background: 'var(--de-color-bg)',
  color: 'var(--de-color-text-muted)',
  cursor: 'pointer',
};

export function GradientEditor({ gradient, onChange }: GradientEditorProps) {
  const { type, angle, stops } = gradient;

  const setStops = (next: GradientStop[]) =>
    onChange({ ...gradient, stops: next });
  const updateStop = (index: number, patch: Partial<GradientStop>) =>
    setStops(
      stops.map((stop, i) => (i === index ? { ...stop, ...patch } : stop))
    );

  const addStop = () => {
    const sorted = [...stops].sort((a, b) => a.offset - b.offset);
    const gaps = sorted.slice(1).map((stop, i) => ({
      offset: (sorted[i].offset + stop.offset) / 2,
      width: stop.offset - sorted[i].offset,
      color: stop.color,
    }));
    const widest = gaps.reduce(
      (best, gap) => (gap.width > best.width ? gap : best),
      {
        offset: 0.5,
        width: -1,
        color: sorted[0]?.color ?? '#ffffff',
      }
    );
    setStops([...stops, { offset: widest.offset, color: widest.color }]);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 232 }}
    >
      <div
        aria-label="Gradient preview"
        style={{
          height: 36,
          borderRadius: 8,
          border: '1px solid var(--de-color-border)',
          background: gradientToCss(gradient),
        }}
      />

      {type === 'linear' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...LABEL, width: 40 }}>Angle</span>
          <input
            aria-label="Gradient angle"
            max={360}
            min={0}
            style={{ flex: 1, accentColor: 'var(--de-color-primary)' }}
            type="range"
            value={angle}
            onChange={(e) =>
              onChange({ ...gradient, angle: Number(e.target.value) })
            }
          />
          <span style={{ ...LABEL, width: 34, textAlign: 'right' }}>
            {angle}°
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={LABEL}>Color stops</span>
        <button
          aria-label="Add color stop"
          onClick={addStop}
          style={ICON_BTN}
          type="button"
        >
          <Plus size={14} />
        </button>
      </div>

      {stops.map((stop, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key -- stops have no identity
          key={index}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <input
            aria-label={`Stop ${index + 1} color`}
            onChange={(e) => updateStop(index, { color: e.target.value })}
            type="color"
            value={stop.color}
            style={{
              width: 28,
              height: 24,
              padding: 0,
              border: 'none',
              background: 'none',
            }}
          />
          <input
            aria-label={`Stop ${index + 1} position`}
            max={100}
            min={0}
            style={{ flex: 1, accentColor: 'var(--de-color-primary)' }}
            type="range"
            value={Math.round(stop.offset * 100)}
            onChange={(e) =>
              updateStop(index, { offset: Number(e.target.value) / 100 })
            }
          />
          <span style={{ ...LABEL, width: 34, textAlign: 'right' }}>
            {Math.round(stop.offset * 100)}%
          </span>
          <button
            aria-label={`Remove stop ${index + 1}`}
            disabled={stops.length <= 2}
            onClick={() => setStops(stops.filter((_, i) => i !== index))}
            style={{ ...ICON_BTN, opacity: stops.length <= 2 ? 0.4 : 1 }}
            type="button"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
