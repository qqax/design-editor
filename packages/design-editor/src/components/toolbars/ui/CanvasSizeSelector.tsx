import React from 'react';

import { Button, Popover, Select } from '../../primitives';
import { AD_SIZES, useCanvasSize } from '../model';

import type { Editor } from '../../../engine';
import type { SelectOption, SelectOptions } from '../../primitives';

interface CanvasSizeSelectorProps {
  editor: Editor | null;
  adSizes?: SelectOptions;
}

export const CanvasSizeSelector = ({
  editor,
  adSizes = AD_SIZES,
}: CanvasSizeSelectorProps) => {
  const {
    size,
    customOpen,
    setCustomOpen,
    customW,
    setCustomW,
    customH,
    setCustomH,
    handleSizeChange,
    handleApplyCustom,
  } = useCanvasSize(editor);

  // A restored scene or template may use a size that is not one of the presets;
  // surface it so the select reflects the canvas instead of falling back to a
  // blank/incorrect entry.
  const options = React.useMemo<SelectOptions>(() => {
    const isFlat = (list: SelectOptions): list is SelectOption[] =>
      list.length === 0 || 'value' in list[0];

    if (!size || !isFlat(adSizes) || adSizes.some((o) => o.value === size)) {
      return adSizes;
    }
    const [width, height] = size.split('x');
    return [{ label: `${width}×${height} (Custom)`, value: size }, ...adSizes];
  }, [adSizes, size]);

  return (
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
            <div className="de-size-field">
              <input
                className="de-size-input"
                max={8000}
                min={100}
                onChange={(e) => setCustomW(Number(e.target.value) || 100)}
                placeholder="Width"
                type="number"
                value={customW}
              />
              <span className="de-size-unit">px</span>
            </div>
            <span
              style={{ color: 'var(--de-color-text-muted)', fontWeight: 600 }}
            >
              ×
            </span>
            <div className="de-size-field">
              <input
                className="de-size-input"
                max={8000}
                min={100}
                onChange={(e) => setCustomH(Number(e.target.value) || 100)}
                placeholder="Height"
                type="number"
                value={customH}
              />
              <span className="de-size-unit">px</span>
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
        onValueChange={handleSizeChange}
        options={options}
        style={{ width: 'auto', minWidth: 160, maxWidth: 220 }}
        value={size}
      />
    </Popover>
  );
};
