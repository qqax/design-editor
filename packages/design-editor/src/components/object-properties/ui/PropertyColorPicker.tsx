import { useCallback, useEffect, useState } from 'react';

import { Popover } from '../../primitives';
import { hslToRgb } from '../lib';
import { SWATCHES } from '../model';

interface PropertyColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tooltip: string;
  activeObjId: string;
}

export function PropertyColorPicker({
  color,
  onChange,
  tooltip,
  activeObjId,
}: PropertyColorPickerProps) {
  const [hex, setHex] = useState(color);
  const [open, setOpen] = useState(false);

  // Sync hex when color prop or active object changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHex(color);
  }, [color, activeObjId]);

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

  const pickerContent = (
    <div
      style={{
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '4px 2px',
      }}
    >
      {/* Hue gradient bar */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const hue = Math.round(pct * 360);
          const hex6 = `#${[0, 8, 16]
            .map((s) => {
              const c = Math.round(
                hslToRgb(hue / 360, 1, 0.5)[(s / 8) as 0 | 1 | 2]
              );
              return c.toString(16).padStart(2, '0');
            })
            .join('')}`;
          onChange(hex6);
          setHex(hex6);
        }}
        style={{
          height: 10,
          borderRadius: 6,
          background:
            'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          cursor: 'crosshair',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        }}
      />

      {/* Swatches Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
        }}
      >
        {SWATCHES.map((sw) => (
          <button
            key={sw}
            aria-label={`Color swatch ${sw}`}
            title={sw}
            type="button"
            onClick={() => {
              onChange(sw);
              setHex(sw);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 6,
              border:
                color.toLowerCase() === sw.toLowerCase()
                  ? '2px solid var(--color-primary)'
                  : '1px solid rgba(0,0,0,0.12)',
              background: sw,
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          />
        ))}
      </div>

      {/* Hex + native color input */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: color,
              border: '1.5px solid var(--color-border)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          />
          <input
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
        <input
          maxLength={7}
          onBlur={(e) => commitHex(e.target.value)}
          onChange={(e) => setHex(e.target.value)}
          spellCheck={false}
          value={hex}
          onBlurCapture={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
          }}
          onKeyDown={(e) =>
            e.key === 'Enter' && commitHex((e.target as HTMLInputElement).value)
          }
          style={{
            flex: 1,
            height: 34,
            border: '1.5px solid var(--color-border)',
            borderRadius: 8,
            padding: '0 8px',
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 600,
            letterSpacing: '0.04em',
            background:
              'color-mix(in srgb, var(--color-text) 4%, var(--color-surface))',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />
      </div>
    </div>
  );

  // KEY FIX: Popover wraps the button directly, NO nested Radix Tooltip inside trigger.
  // The tooltip is now done with the native `title` attribute on the button,
  // avoiding the Radix nested trigger/portal click-blocking issue.
  return (
    <Popover
      content={pickerContent}
      onOpenChange={setOpen}
      open={open}
      placement="top"
    >
      <button
        aria-label="Color picker"
        title={tooltip}
        type="button"
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor =
              'color-mix(in srgb, var(--color-text) 30%, var(--color-border))';
            e.currentTarget.style.background =
              'color-mix(in srgb, var(--color-text) 4%, var(--color-bg))';
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.background = 'var(--color-bg)';
          }
        }}
        style={{
          height: 30,
          width: 38,
          padding: 3,
          borderRadius: 8,
          border: open
            ? '1.5px solid var(--color-primary)'
            : '1px solid var(--color-border)',
          background: open
            ? 'color-mix(in srgb, var(--color-primary) 8%, var(--color-bg))'
            : 'var(--color-bg)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease',
          outline: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 5,
            border: '1px solid rgba(0,0,0,0.12)',
            background: color,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
          }}
        />
      </button>
    </Popover>
  );
}
