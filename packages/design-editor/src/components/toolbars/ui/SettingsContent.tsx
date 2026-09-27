import React from 'react';

import { Settings } from 'lucide-react';

import { Popover, Segmented, Switch } from '../../primitives';

import type { PageOffsets, SettingsType } from '../../../engine';

interface SettingsProps {
  settings: SettingsType;
  onSettings: (s: Partial<SettingsType>) => void;
  offsets: PageOffsets;
  onOffsetsChange: (offsets: PageOffsets) => void;
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

const EDGES = ['top', 'right', 'bottom', 'left'] as const;

const TOGGLES = [
  { label: 'Grid overlay', key: 'showGrid' },
  { label: 'Rulers', key: 'showRulers' },
  { label: 'Snap to guides', key: 'snapToGuides' },
] as const;

const SettingsContent = ({
  settings,
  onSettings,
  offsets,
  onOffsetsChange,
  theme,
  onThemeChange,
}: SettingsProps) => (
  <div className="de-form" style={{ width: 232 }}>
    <div className="de-popover-title">Editor Settings</div>
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
    {TOGGLES.map(({ label, key }) => (
      <div key={key} className="de-form-row">
        <span className="de-form-label">{label}</span>
        <Switch
          aria-label={label}
          checked={settings[key]}
          onCheckedChange={(v) => onSettings({ [key]: v })}
        />
      </div>
    ))}
    <div className="de-form-section">
      <div className="de-form-section-title">Rulers count from</div>
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
    <div className="de-form-section">
      <div className="de-form-section-title">Page offsets, px</div>
      <div className="de-form-grid">
        {EDGES.map((edge) => (
          <div key={edge} className="de-form-row">
            <span
              className="de-form-label"
              style={{ textTransform: 'capitalize' }}
            >
              {edge}
            </span>
            <input
              aria-label={`${edge} offset`}
              className="de-num-input"
              min={0}
              type="number"
              value={offsets[edge]}
              onChange={(e) =>
                onOffsetsChange({
                  ...offsets,
                  [edge]: Math.max(0, Math.round(Number(e.target.value) || 0)),
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
    {/* Panel rail side, disabled for now:
    <div className="de-form-section">
      <div className="de-form-section-title">Panel Rail</div>
      <Segmented
        label="Panel rail side"
        value={settings.railSide}
        onChange={(railSide) => onSettings({ railSide })}
        options={[
          ['left', 'Left'],
          ['right', 'Right'],
        ]}
      />
    </div> */}
  </div>
);

export const CanvasSettings = (props: SettingsProps) => (
  <Popover content={<SettingsContent {...props} />} placement="bottom">
    <button aria-label="Settings" className="de-tool-btn" type="button">
      <Settings size={18} />
    </button>
  </Popover>
);
