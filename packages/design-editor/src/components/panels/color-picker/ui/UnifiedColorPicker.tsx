import { useState } from 'react';

import { ColorPickerPanel } from './ColorPickerPanel';
import { GradientEditor } from './GradientEditor';
import { gradientToCss } from '../../../../engine';
import { Popover, Tooltip } from '../../../primitives';
import { solidLayer } from '../lib';
import { SWATCHES } from '../model';

import type { GradientFill } from '../../../../engine';

interface UnifiedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tooltip: string;
  variant: 'property-bar' | 'tool-bar';
  activeObjId?: string;
  label?: string;
  /** Adds an opacity slider; the swatch is drawn over a checkerboard */
  alpha?: boolean;
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
  alpha = false,
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
  const fill = gradient ? gradientToCss(gradient) : color || emptySwatch;
  const swatch = alpha
    ? `${gradient ? fill : solidLayer(fill)}, var(--de-checker)`
    : fill;

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
    <ColorPickerPanel
      alpha={alpha}
      color={color}
      onChange={onChange}
      swatches={SWATCHES}
    />
  );

  const content = onGradientChange ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="de-segmented" role="tablist">
        {MODES.map((option) => (
          <button
            key={option.value}
            aria-selected={mode === option.value}
            className="de-segment"
            onClick={() => selectMode(option.value)}
            role="tab"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {gradient ? (
        <GradientEditor
          alpha={alpha}
          gradient={gradient}
          onChange={onGradientChange}
        />
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
              aria-label={label || 'Color picker'}
              className="de-swatch-btn"
              data-active={open}
              type="button"
            >
              <span className="de-swatch" style={{ background: swatch }} />
            </button>
          ) : (
            <button
              aria-label={label || 'Select color'}
              className="de-tool-btn"
              data-active={open}
              type="button"
            >
              <span
                className="de-swatch de-swatch-sm"
                style={{ background: swatch }}
              />
              <span className="de-hide-mobile">{label}</span>
            </button>
          )}
        </Tooltip>
      </div>
    </Popover>
  );
}
