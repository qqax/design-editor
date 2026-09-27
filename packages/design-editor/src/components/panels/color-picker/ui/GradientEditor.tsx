'use client';

import { Plus, X } from 'lucide-react';

import { gradientToCss } from '../../../../engine';
import { solidLayer, splitAlpha, withAlpha } from '../lib';

import type { GradientFill, GradientStop } from '../../../../engine';

interface GradientEditorProps {
  gradient: GradientFill;
  onChange: (gradient: GradientFill) => void;
  /** Per-stop opacity */
  alpha?: boolean;
}

export function GradientEditor({
  gradient,
  onChange,
  alpha = false,
}: GradientEditorProps) {
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
    <div className="de-gradient-editor">
      <div
        aria-label="Gradient preview"
        className="de-gradient-preview"
        style={{ background: `${gradientToCss(gradient)}, var(--de-checker)` }}
      />

      {type === 'linear' && (
        <div className="de-gradient-row">
          <span className="de-gradient-label">Angle</span>
          <input
            aria-label="Gradient angle"
            className="de-range"
            max={360}
            min={0}
            type="range"
            value={angle}
            onChange={(e) =>
              onChange({ ...gradient, angle: Number(e.target.value) })
            }
          />
          <span className="de-gradient-value">{angle}°</span>
        </div>
      )}

      <div className="de-gradient-row">
        <span className="de-gradient-label" style={{ flex: 1 }}>
          Color stops
        </span>
        <button
          aria-label="Add color stop"
          className="de-icon-btn de-icon-btn-sm"
          onClick={addStop}
          type="button"
        >
          <Plus size={14} />
        </button>
      </div>

      {stops.map((stop, index) => {
        const parts = splitAlpha(stop.color);
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key -- stops have no identity
            key={index}
            className="de-gradient-row"
          >
            <span
              className="de-color-preview de-gradient-stop-color"
              style={{
                background: `${solidLayer(stop.color)}, var(--de-checker)`,
              }}
            >
              <input
                aria-label={`Stop ${index + 1} color`}
                type="color"
                value={parts.hex}
                onChange={(e) =>
                  updateStop(index, {
                    color: withAlpha(e.target.value, parts.alpha),
                  })
                }
              />
            </span>
            <input
              aria-label={`Stop ${index + 1} position`}
              className="de-range"
              max={100}
              min={0}
              type="range"
              value={Math.round(stop.offset * 100)}
              onChange={(e) =>
                updateStop(index, { offset: Number(e.target.value) / 100 })
              }
            />
            <span className="de-gradient-value">
              {Math.round(stop.offset * 100)}%
            </span>
            {alpha ? (
              <input
                aria-label={`Stop ${index + 1} opacity`}
                className="de-num-input"
                max={100}
                min={0}
                title="Opacity, %"
                type="number"
                value={Math.round(parts.alpha * 100)}
                onChange={(e) =>
                  updateStop(index, {
                    color: withAlpha(parts.hex, Number(e.target.value) / 100),
                  })
                }
              />
            ) : null}
            <button
              aria-label={`Remove stop ${index + 1}`}
              className="de-icon-btn de-icon-btn-sm"
              disabled={stops.length <= 2}
              onClick={() => setStops(stops.filter((_, i) => i !== index))}
              type="button"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
