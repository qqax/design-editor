import React, { useCallback, useState } from 'react';

import { hslToRgb } from '../lib';

interface ColorPickerPanelProps {
  color: string;
  onChange: (color: string) => void;
  swatches: string[];
}

export function ColorPickerPanel({
  color,
  onChange,
  swatches,
}: ColorPickerPanelProps) {
  const [hex, setHex] = useState(color);
  const [prevColor, setPrevColor] = useState(color);

  if (color !== prevColor) {
    setPrevColor(color);
    setHex(color);
  }

  const commitHex = useCallback(
    (val: string) => {
      const clean = val.startsWith('#') ? val : `#${val}`;
      if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
        onChange(clean);
        setHex(clean);
      }
    },
    [onChange]
  );

  return (
    <div
      style={{
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '4px 2px',
      }}
    >
      <div
        aria-label="Pick hue color spectrum"
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const hue = Math.round(pct * 360);
          const hex6 = `#${[0, 8, 16]
            .map((s) => {
              const rgbIndex = (s / 8) as 0 | 1 | 2;
              const c = Math.round(hslToRgb(hue / 360, 1, 0.5)[rgbIndex]);
              return c.toString(16).padStart(2, '0');
            })
            .join('')}`;
          onChange(hex6);
          setHex(hex6);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
        style={{
          height: 10,
          borderRadius: 6,
          background:
            'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          cursor: 'crosshair',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          outline: 'none',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 8,
        }}
      >
        {swatches.map((sw) => (
          <button
            key={sw}
            aria-label={`Select color ${sw}`}
            title={sw}
            type="button"
            onClick={() => {
              onChange(sw);
              setHex(sw);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              border:
                color.toLowerCase() === sw.toLowerCase()
                  ? '2px solid var(--color-primary)'
                  : '1.5px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
              background: sw,
              cursor: 'pointer',
              transition:
                'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s',
              boxShadow:
                color.toLowerCase() === sw.toLowerCase()
                  ? '0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary)'
                  : '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
        ))}
      </div>

      <div
        style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: color,
              border:
                '2px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          />
          <input
            aria-label="Native color selection point"
            type="color"
            value={color}
            onChange={(e) => {
              onChange(e.target.value);
              setHex(e.target.value);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              padding: 0,
              border: 'none',
            }}
          />
        </div>

        <div style={{ position: 'relative', flex: 1 }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}
          >
            #
          </span>
          <input
            aria-label="Hex color string fallback"
            maxLength={6}
            onChange={(e) => setHex(e.target.value)}
            spellCheck={false}
            value={hex.replace(/^#/, '')}
            onBlur={(e) => {
              commitHex(e.target.value);
              e.target.style.boxShadow = 'inset 0 0 0 1px transparent';
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = 'inset 0 0 0 2px var(--color-primary)';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitHex((e.target as HTMLInputElement).value);
              }
            }}
            style={{
              width: '100%',
              height: 40,
              boxSizing: 'border-box',
              border: 'none',
              borderRadius: 10,
              padding: '0 12px 0 28px',
              fontSize: 14,
              fontFamily: 'var(--de-font-mono, monospace)',
              fontWeight: 600,
              textTransform: 'uppercase',
              background:
                'color-mix(in srgb, var(--color-text) 5%, transparent)',
              color: 'var(--color-text)',
              outline: 'none',
              transition: 'box-shadow 0.2s',
              boxShadow: 'inset 0 0 0 1px transparent',
            }}
          />
        </div>
      </div>
    </div>
  );
}
