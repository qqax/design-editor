import React, { useState } from 'react';

import { useMessages } from '../../../messages';
import { getStorageSafe, setStorageSafe } from '../../design-editor/lib';
import { Button, Popover, Segmented, Select } from '../../primitives';
import {
  defaultCanvasSizes,
  pageSetupFromPixels,
  pageSetupToPixels,
  parseSizeValue,
  useCanvasSize,
} from '../model';

import type { Editor, LengthUnit, PageOffsets } from '../../../engine';
import type { SelectOption, SelectOptions } from '../../primitives';
import type { PageSetup } from '../model';

const UNIT_KEY = 'studio_size_unit';
const UNITS: readonly LengthUnit[] = ['px', 'mm', 'in'];

interface CanvasSizeSelectorProps {
  editor: Editor | null;
  adSizes?: SelectOptions;
  offsets: PageOffsets;
  dpi: number;
  onDpiChange: (dpi: number) => void;
  /** A custom size was applied; offsets carry the bleed */
  onPageSetup: (setup: PageSetup) => void;
}

interface CustomSizeFormProps {
  frame: { width: number; height: number };
  offsets: PageOffsets;
  dpi: number;
  onApply: (setup: PageSetup) => void;
}

/** Mounted each time the popover opens, so it starts from the current page */
function CustomSizeForm({ frame, offsets, dpi, onApply }: CustomSizeFormProps) {
  const m = useMessages().canvasSize;
  const [unit, setUnit] = useState<LengthUnit>(() => {
    const stored = getStorageSafe<LengthUnit>(UNIT_KEY, 'px');
    return UNITS.includes(stored) ? stored : 'px';
  });
  const [resolution, setResolution] = useState(dpi);
  const [fields, setFields] = useState(() =>
    pageSetupFromPixels(frame, offsets, unit, dpi)
  );

  const changeUnit = (next: LengthUnit) => {
    const setup = pageSetupToPixels({ unit, ...fields, dpi: resolution });
    setFields(
      pageSetupFromPixels(
        { width: setup.width, height: setup.height },
        setup.offsets,
        next,
        setup.dpi
      )
    );
    setUnit(next);
    setStorageSafe(UNIT_KEY, next);
  };

  const setup = pageSetupToPixels({ unit, ...fields, dpi: resolution });
  const unitName = m.unitNames[unit];
  const step = unit === 'px' ? 1 : 0.1;

  const field = (key: keyof typeof fields, label: string) => (
    <div className="de-size-field">
      <span className="de-size-label">
        {label}, {unitName}
      </span>
      <input
        aria-label={`${label}, ${unitName}`}
        className="de-size-input"
        min={0}
        step={step}
        type="number"
        value={fields[key]}
        onChange={(e) =>
          setFields((prev) => ({ ...prev, [key]: Number(e.target.value) }))
        }
      />
    </div>
  );

  return (
    <div className="de-form" style={{ width: 240 }}>
      <div className="de-popover-title">{m.customTitle}</div>
      <Segmented
        label={m.units}
        onChange={changeUnit}
        options={UNITS.map((option) => [option, m.unitNames[option]] as const)}
        value={unit}
      />
      <div className="de-form-grid">
        {field('width', m.width)}
        {field('height', m.height)}
        {field('bleed', m.bleed)}
        {unit === 'px' ? null : (
          <div className="de-size-field">
            <span className="de-size-label">{m.resolution}, dpi</span>
            <input
              aria-label={`${m.resolution}, dpi`}
              className="de-size-input"
              min={1}
              onChange={(e) => setResolution(Number(e.target.value))}
              step={1}
              type="number"
              value={resolution}
            />
          </div>
        )}
      </div>
      <div className="de-form-hint">
        {m.result(setup.width, setup.height, setup.offsets.top > 0)}
      </div>
      <Button onClick={() => onApply(setup)} size="sm" variant="primary">
        {m.apply}
      </Button>
    </div>
  );
}

export const CanvasSizeSelector = ({
  editor,
  adSizes: adSizesProp,
  offsets,
  dpi,
  onDpiChange,
  onPageSetup,
}: CanvasSizeSelectorProps) => {
  const m = useMessages().canvasSize;
  const adSizes = React.useMemo(
    () => adSizesProp ?? defaultCanvasSizes(m),
    [adSizesProp, m]
  );
  const {
    size,
    frame,
    customOpen,
    setCustomOpen,
    applySize,
    handleSizeChange,
  } = useCanvasSize(editor, onDpiChange);

  // Presets may carry "@dpi"; a restored scene may match none of them.
  const [options, value] = React.useMemo((): [SelectOptions, string] => {
    const isFlat = (list: SelectOptions): list is SelectOption[] =>
      list.length === 0 || 'value' in list[0];
    const matching = (list: SelectOption[]) =>
      list.find((option) => {
        const parsed = parseSizeValue(option.value);
        return parsed && `${parsed.width}x${parsed.height}` === size;
      });

    if (!isFlat(adSizes)) {
      const found = adSizes
        .map((group) => matching(group.options))
        .find(Boolean);
      return [adSizes, found?.value ?? size];
    }
    const found = matching(adSizes);
    if (found) return [adSizes, found.value];
    const [width, height] = size.split('x').map(Number);
    return [
      [{ label: m.current(width, height), value: size }, ...adSizes],
      size,
    ];
  }, [adSizes, size, m]);

  return (
    <Popover
      onOpenChange={(open) => !open && setCustomOpen(false)}
      open={customOpen}
      placement="bottom"
      content={
        customOpen ? (
          <CustomSizeForm
            dpi={dpi}
            frame={frame}
            offsets={offsets}
            onApply={(setup) => {
              setCustomOpen(false);
              applySize(setup.width, setup.height);
              onPageSetup(setup);
            }}
          />
        ) : null
      }
    >
      <Select
        aria-label={m.label}
        onValueChange={handleSizeChange}
        options={options}
        style={{ width: 'auto', minWidth: 160, maxWidth: 220 }}
        value={value}
      />
    </Popover>
  );
};
