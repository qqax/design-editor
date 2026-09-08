import React, { useEffect, useState } from 'react';

import { ColorPickerPanel } from './ColorPickerPanel';
import { Popover, Tooltip } from '../../../primitives';
import { SWATCHES, TOOL_BTN } from '../model';

interface UnifiedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tooltip: string;
  variant: 'property-bar' | 'tool-bar';
  activeObjId?: string;
  label?: string;
  checkerboard?: boolean;
}

export function UnifiedColorPicker({
  color,
  onChange,
  tooltip,
  variant,
  activeObjId,
  label,
  checkerboard,
}: UnifiedColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [currentActiveId, setCurrentActiveId] = useState(activeObjId);

  useEffect(() => {
    if (activeObjId !== currentActiveId) {
      setOpen(false);
      setCurrentActiveId(activeObjId);
    }
  }, [activeObjId, currentActiveId]);

  const placement = variant === 'property-bar' ? 'top' : 'bottom';

  const content = (
    <ColorPickerPanel color={color} onChange={onChange} swatches={SWATCHES} />
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
          ) : (
            <button
              aria-label={label || 'Select color'}
              type="button"
              style={{
                ...TOOL_BTN,
                padding: '4px 8px',
                gap: 6,
                width: 'auto',
                background: open
                  ? 'color-mix(in srgb, var(--color-primary) 18%, transparent)'
                  : TOOL_BTN?.background,
                boxShadow: open ? '0 0 0 1px var(--color-primary)' : 'none',
              }}
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
                    : color,
                  flexShrink: 0,
                  boxShadow: '0 1px 5px rgba(0,0,0,0.22)',
                  overflow: 'hidden',
                }}
              />
              <span
                className="hidden md:inline"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                }}
              >
                {label}
              </span>
            </button>
          )}
        </Tooltip>
      </div>
    </Popover>
  );
}
