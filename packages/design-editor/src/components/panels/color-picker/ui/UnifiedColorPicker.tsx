import React, { useState } from 'react';

import { ColorPickerPanel } from './ColorPickerPanel';
import { GradientEditor } from './GradientEditor';
import { gradientToCss } from '../../../../engine';
import { Popover, Tooltip } from '../../../primitives';
import { SWATCHES } from '../model';

import type { GradientFill } from '../../../../engine';

interface UnifiedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tooltip: string;
  variant: 'property-bar' | 'tool-bar';
  activeObjId?: string;
  label?: string;
  checkerboard?: boolean;
  /** Enables the Linear/Radial modes */
  onGradientChange?: (gradient: GradientFill) => void;
  gradient?: GradientFill | null;
  /** Swatch shown while `color` is empty */
  emptySwatch?: string;
}

type FillMode = 'solid' | GradientFill['type'];

const MODES: { value: FillMode; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
];

export function UnifiedColorPicker({
  color,
  onChange,
  tooltip,
  variant,
  activeObjId,
  label,
  checkerboard,
  onGradientChange,
  gradient = null,
  emptySwatch = 'transparent',
}: UnifiedColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [prevActiveObjId, setPrevActiveObjId] = useState(activeObjId);

  if (activeObjId !== prevActiveObjId) {
    setPrevActiveObjId(activeObjId);
    setOpen(false);
  }

  const placement = variant === 'property-bar' ? 'top' : 'bottom';

  const mode: FillMode = gradient ? gradient.type : 'solid';
  const swatch = gradient ? gradientToCss(gradient) : color || emptySwatch;

  const selectMode = (next: FillMode) => {
    if (next === mode) return;
    if (next === 'solid') {
      onChange(gradient?.stops[0]?.color ?? color);
    } else {
      onGradientChange?.(
        gradient
          ? { ...gradient, type: next }
          : {
              type: next,
              angle: 90,
              stops: [
                { offset: 0, color },
                {
                  offset: 1,
                  color:
                    color.toLowerCase() === '#ffffff' ? '#000000' : '#ffffff',
                },
              ],
            }
      );
    }
  };

  const panel = (
    <ColorPickerPanel color={color} onChange={onChange} swatches={SWATCHES} />
  );

  const content = onGradientChange ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div role="tablist" style={{ display: 'flex', gap: 4 }}>
        {MODES.map((option) => (
          <button
            key={option.value}
            aria-selected={mode === option.value}
            onClick={() => selectMode(option.value)}
            role="tab"
            type="button"
            style={{
              flex: 1,
              height: 28,
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              border:
                mode === option.value
                  ? '1.5px solid var(--de-color-primary)'
                  : '1px solid var(--de-color-border)',
              background:
                mode === option.value
                  ? 'color-mix(in srgb, var(--de-color-primary) 15%, transparent)'
                  : 'var(--de-color-bg)',
              color:
                mode === option.value
                  ? 'var(--de-color-primary)'
                  : 'var(--de-color-text-muted)',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      {gradient ? (
        <GradientEditor gradient={gradient} onChange={onGradientChange} />
      ) : (
        panel
      )}
    </div>
  ) : (
    panel
  );

  return (
    <Popover
      content={content}
      onOpenChange={setOpen}
      open={open}
      placement={placement}
    >
      <div style={{ display: 'inline-block' }}>
        <Tooltip placement={placement} title={tooltip}>
          {variant === 'property-bar' ? (
            <button
              aria-label="Color picker"
              type="button"
              onMouseEnter={(e) => {
                if (!open) {
                  e.currentTarget.style.borderColor =
                    'color-mix(in srgb, var(--de-color-text) 30%, var(--de-color-border))';
                  e.currentTarget.style.background =
                    'color-mix(in srgb, var(--de-color-text) 4%, var(--de-color-bg))';
                }
              }}
              onMouseLeave={(e) => {
                if (!open) {
                  e.currentTarget.style.borderColor = 'var(--de-color-border)';
                  e.currentTarget.style.background = 'var(--de-color-bg)';
                }
              }}
              style={{
                height: 30,
                width: 38,
                padding: 3,
                borderRadius: 8,
                border: open
                  ? '1.5px solid var(--de-color-primary)'
                  : '1px solid var(--de-color-border)',
                background: open
                  ? 'color-mix(in srgb, var(--de-color-primary) 8%, var(--de-color-bg))'
                  : 'var(--de-color-bg)',
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
                  background: swatch,
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                }}
              />
            </button>
          ) : (
            <button
              aria-label={label || 'Select color'}
              className="de-tool-btn"
              data-active={open}
              type="button"
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: '1.5px solid rgba(0,0,0,0.15)',
                  background: checkerboard
                    ? `linear-gradient(${color}, ${color}), repeating-conic-gradient(#bbb 0% 25%, #fff 0% 50%) 0 0 / 8px 8px`
                    : swatch,
                  flexShrink: 0,
                  boxShadow: '0 1px 5px rgba(0,0,0,0.22)',
                  overflow: 'hidden',
                }}
              />
              <span className="de-hide-mobile">{label}</span>
            </button>
          )}
        </Tooltip>
      </div>
    </Popover>
  );
}
