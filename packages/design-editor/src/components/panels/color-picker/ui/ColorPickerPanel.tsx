import { useState } from 'react';

import { useMessages } from '../../../../messages';
import {
  hslToRgb,
  parseHexInput,
  solidLayer,
  splitAlpha,
  withAlpha,
} from '../lib';

interface ColorPickerPanelProps {
  color: string;
  onChange: (color: string) => void;
  swatches: string[];
  /** Adds the opacity slider and `#rrggbbaa` output */
  alpha?: boolean;
}

const toHex = (channels: [number, number, number]) =>
  `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;

export function ColorPickerPanel({
  color,
  onChange,
  swatches,
  alpha = false,
}: ColorPickerPanelProps) {
  const m = useMessages().color;
  const parts = splitAlpha(color);
  const displayHex = (value: string) =>
    (alpha ? value : splitAlpha(value).hex).replace(/^#/, '');

  const [draft, setDraft] = useState(displayHex(color));
  const [prevColor, setPrevColor] = useState(color);

  if (color !== prevColor) {
    setPrevColor(color);
    setDraft(displayHex(color));
  }

  // Picking a hue on a fully transparent colour would otherwise look like a no-op.
  const emitHex = (hex: string) => {
    if (!alpha) {
      onChange(hex);
      return;
    }
    onChange(withAlpha(hex, parts.alpha === 0 ? 1 : parts.alpha));
  };

  const commitDraft = (value: string) => {
    const parsed = parseHexInput(value, alpha);
    if (parsed) onChange(parsed);
    else setDraft(displayHex(color));
  };

  const alphaPct = Math.round(parts.alpha * 100);

  return (
    <div className="de-color-panel">
      <div
        aria-label={m.hue}
        className="de-color-hue"
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const hue = (e.clientX - rect.left) / rect.width;
          emitHex(toHex(hslToRgb(hue, 1, 0.5)));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
        }}
      />

      <div className="de-color-swatches">
        {swatches.map((sw) => (
          <button
            key={sw}
            aria-label={m.swatch(sw)}
            className="de-color-swatch"
            data-selected={parts.hex === sw.toLowerCase()}
            onClick={() => emitHex(sw.toLowerCase())}
            style={{ background: sw }}
            title={sw}
            type="button"
          />
        ))}
      </div>

      {alpha ? (
        <div className="de-color-alpha">
          <input
            aria-label={m.opacity}
            className="de-alpha-slider"
            max={100}
            min={0}
            type="range"
            value={alphaPct}
            onChange={(e) =>
              onChange(withAlpha(parts.hex, Number(e.target.value) / 100))
            }
            style={{
              background: `linear-gradient(to right, transparent, ${parts.hex}), var(--de-checker)`,
            }}
          />
          <span className="de-color-alpha-value">{alphaPct}%</span>
        </div>
      ) : null}

      <div className="de-color-row">
        <div
          className="de-color-preview"
          style={{
            background: alpha
              ? `${solidLayer(color || 'transparent')}, var(--de-checker)`
              : parts.hex,
          }}
        >
          <input
            aria-label={m.systemPicker}
            onChange={(e) => emitHex(e.target.value)}
            type="color"
            value={parts.hex}
          />
        </div>
        <div className="de-color-hex">
          <span>#</span>
          <input
            aria-label={m.hex}
            maxLength={alpha ? 8 : 6}
            onBlur={(e) => commitDraft(e.target.value)}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            value={draft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitDraft(e.currentTarget.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
