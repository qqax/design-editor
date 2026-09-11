import React from 'react';

import { AD_SIZES } from '../../hooks/useCanvasSize';
import { Button, Popover, Select } from '../primitives';

interface CanvasSizeSelectorProps {
  size: string;
  customOpen: boolean;
  setCustomOpen: (open: boolean) => void;
  customW: number;
  setCustomW: (w: number) => void;
  customH: number;
  setCustomH: (h: number) => void;
  handleApplyCustom: () => void;
  handleSizeChange: (size: string) => void;
}

export const CanvasSizeSelector = ({
  size,
  customOpen,
  setCustomOpen,
  customW,
  setCustomW,
  customH,
  setCustomH,
  handleApplyCustom,
  handleSizeChange,
}: CanvasSizeSelectorProps) => (
  <Popover
    onOpenChange={(open) => !open && setCustomOpen(false)}
    open={customOpen}
    placement="bottom"
    content={
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: 220,
          padding: 4,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 12,
            color: 'var(--de-color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          Custom Canvas Size
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="relative flex-1">
            <input
              className="w-full rounded-md border border-transparent bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] px-3 py-1.5 text-sm outline-none focus:border-[var(--de-color-primary)]"
              max={8000}
              min={100}
              onChange={(e) => setCustomW(Number(e.target.value) || 100)}
              placeholder="Width"
              type="number"
              value={customW}
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-(--de-color-text-muted)">
              px
            </span>
          </div>
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
            ×
          </span>
          <div className="relative flex-1">
            <input
              className="w-full rounded-md border border-transparent bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] px-3 py-1.5 text-sm outline-none focus:border-[var(--de-color-primary)]"
              max={8000}
              min={100}
              onChange={(e) => setCustomH(Number(e.target.value) || 100)}
              placeholder="Height"
              type="number"
              value={customH}
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-(--de-color-text-muted)">
              px
            </span>
          </div>
        </div>
        <Button
          onClick={handleApplyCustom}
          size="sm"
          style={{ width: '100%' }}
          variant="primary"
        >
          Apply
        </Button>
      </div>
    }
  >
    <Select
      className="studio-size-select flex-1 md:flex-none"
      onValueChange={handleSizeChange}
      options={AD_SIZES}
      style={{ width: 'auto', minWidth: 160, maxWidth: 220 }}
      value={size}
    />
  </Popover>
);
