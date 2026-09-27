import React from 'react';

import { Settings } from 'lucide-react';

import { Popover, Switch } from '../../primitives';

import type { PageOffsets, SettingsType } from '../../../engine';

interface SettingsProps {
  settings: SettingsType;
  onSettings: (s: Partial<SettingsType>) => void;
  offsets: PageOffsets;
  onOffsetsChange: (offsets: PageOffsets) => void;
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--de-color-text-muted)',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const SECTION: React.CSSProperties = {
  borderTop: '1px solid var(--de-color-border)',
  paddingTop: 12,
};

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (value: T) => void;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div
      aria-label={label}
      role="radiogroup"
      style={{ display: 'flex', gap: 6, marginBottom: 6 }}
    >
      {options.map(([option, text]) => (
        <button
          key={option}
          aria-checked={value === option}
          onClick={() => onChange(option)}
          role="radio"
          type="button"
          style={{
            flex: 1,
            padding: '6px 0',
            borderRadius: 8,
            cursor: 'pointer',
            border:
              value === option
                ? '1.5px solid var(--de-color-primary)'
                : '1px solid var(--de-color-border)',
            background:
              value === option
                ? 'color-mix(in srgb, var(--de-color-primary) 18%, transparent)'
                : 'color-mix(in srgb, var(--de-color-text) 3%, transparent)',
            color:
              value === option
                ? 'var(--de-color-primary)'
                : 'var(--de-color-text-muted)',
            fontSize: 12,
            fontWeight: 700,
            outline: 'none',
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

const EDGES = ['top', 'right', 'bottom', 'left'] as const;

const SettingsContent = ({
  settings,
  onSettings,
  offsets,
  onOffsetsChange,
  theme,
  onThemeChange,
}: SettingsProps) => (
  <div
    style={{
      width: 230,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      boxShadow: '0 10px 30px var(--shadow-color)',
    }}
  >
    <div
      style={{
        fontWeight: 700,
        fontSize: 12,
        color: 'var(--de-color-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      Editor Settings
    </div>
    {theme && onThemeChange ? (
      <Segmented
        label="Theme"
        onChange={onThemeChange}
        value={theme}
        options={[
          ['dark', 'Dark'],
          ['light', 'Light'],
        ]}
      />
    ) : null}
    {[
      { label: 'Grid overlay', key: 'showGrid' as const },
      { label: 'Rulers', key: 'showRulers' as const },
      { label: 'Snap to guides', key: 'snapToGuides' as const },
    ].map(({ label, key }) => (
      <div
        key={key}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--de-color-text)' }}>
          {label}
        </span>
        <Switch
          checked={settings[key]}
          onCheckedChange={(v) => onSettings({ [key]: v })}
        />
      </div>
    ))}
    <div style={SECTION}>
      <div style={SECTION_TITLE}>Rulers count from</div>
      <Segmented
        label="Horizontal ruler origin"
        value={settings.rulerOrigin.x}
        onChange={(x) =>
          onSettings({ rulerOrigin: { ...settings.rulerOrigin, x } })
        }
        options={[
          ['left', 'Left'],
          ['right', 'Right'],
        ]}
      />
      <Segmented
        label="Vertical ruler origin"
        value={settings.rulerOrigin.y}
        onChange={(y) =>
          onSettings({ rulerOrigin: { ...settings.rulerOrigin, y } })
        }
        options={[
          ['top', 'Top'],
          ['bottom', 'Bottom'],
        ]}
      />
    </div>
    <div style={SECTION}>
      <div style={SECTION_TITLE}>Page offsets</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {EDGES.map((edge) => (
          <div
            key={edge}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                width: 44,
                fontSize: 12,
                textTransform: 'capitalize',
                color: 'var(--de-color-text)',
              }}
            >
              {edge}
            </span>
            <input
              aria-label={`${edge} offset`}
              min={0}
              type="number"
              value={offsets[edge]}
              onChange={(e) =>
                onOffsetsChange({
                  ...offsets,
                  [edge]: Math.max(0, Math.round(Number(e.target.value) || 0)),
                })
              }
              style={{
                width: '100%',
                minWidth: 0,
                padding: '4px 6px',
                borderRadius: 6,
                border: '1px solid var(--de-color-border)',
                background: 'var(--de-color-bg)',
                color: 'var(--de-color-text)',
                fontSize: 12,
              }}
            />
          </div>
        ))}
      </div>
    </div>
    {/* <div */}
    {/*  style={{ */}
    {/*    borderTop: '1px solid var(--de-color-border)', */}
    {/*    paddingTop: 12, */}
    {/*  }} */}
    {/* > */}
    {/*  <div */}
    {/*    style={{ */}
    {/*      fontSize: 11, */}
    {/*      color: 'var(--de-color-text-muted)', */}
    {/*      marginBottom: 8, */}
    {/*      textTransform: 'uppercase', */}
    {/*      letterSpacing: '0.06em', */}
    {/*    }} */}
    {/*  > */}
    {/*    Panel Rail */}
    {/*  </div> */}
    {/*  <div style={{ display: 'flex', gap: 6 }}> */}
    {/*    {(['left', 'right'] as const).map((side) => ( */}
    {/*      <button */}
    {/*        key={side} */}
    {/*        onClick={() => onSettings({ railSide: side })} */}
    {/*        type="button" */}
    {/*        style={{ */}
    {/*          flex: 1, */}
    {/*          padding: '7px 0', */}
    {/*          borderRadius: 8, */}
    {/*          cursor: 'pointer', */}
    {/*          border: */}
    {/*            settings.railSide === side */}
    {/*              ? '1.5px solid var(--de-color-primary)' */}
    {/*              : '1px solid var(--de-color-border)', */}
    {/*          background: */}
    {/*            settings.railSide === side */}
    {/*              ? 'color-mix(in srgb, var(--de-color-primary) 18%, transparent)' */}
    {/*              : 'color-mix(in srgb, var(--de-color-text) 3%, transparent)', */}
    {/*          color: */}
    {/*            settings.railSide === side */}
    {/*              ? 'var(--de-color-primary)' */}
    {/*              : 'var(--de-color-text-muted)', */}
    {/*          fontSize: 12, */}
    {/*          fontWeight: 700, */}
    {/*          textTransform: 'capitalize', */}
    {/*          outline: 'none', */}
    {/*        }} */}
    {/*      > */}
    {/*        {side} */}
    {/*      </button> */}
    {/*    ))} */}
    {/*  </div> */}
    {/* </div> */}
  </div>
);

export const CanvasSettings = (props: SettingsProps) => (
  <Popover content={<SettingsContent {...props} />} placement="bottom">
    <button aria-label="Settings" className="de-tool-btn" type="button">
      <Settings size={18} />
    </button>
  </Popover>
);
