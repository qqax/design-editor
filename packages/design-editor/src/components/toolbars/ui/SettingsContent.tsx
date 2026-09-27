import React from 'react';

import { Settings } from 'lucide-react';

import { useMessages } from '../../../messages';
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
  { message: 'grid', key: 'showGrid' },
  { message: 'rulers', key: 'showRulers' },
  { message: 'snapToGuides', key: 'snapToGuides' },
] as const;

const SettingsContent = ({
  settings,
  onSettings,
  offsets,
  onOffsetsChange,
  theme,
  onThemeChange,
}: SettingsProps) => {
  const m = useMessages().settings;
  return (
    <div className="de-form" style={{ width: 232 }}>
      <div className="de-popover-title">{m.title}</div>
      {theme && onThemeChange ? (
        <Segmented
          label={m.theme}
          onChange={onThemeChange}
          value={theme}
          options={[
            ['dark', m.dark],
            ['light', m.light],
          ]}
        />
      ) : null}
      {TOGGLES.map(({ message, key }) => (
        <div key={key} className="de-form-row">
          <span className="de-form-label">{m[message]}</span>
          <Switch
            aria-label={m[message]}
            checked={settings[key]}
            onCheckedChange={(v) => onSettings({ [key]: v })}
          />
        </div>
      ))}
      <div className="de-form-section">
        <div className="de-form-section-title">{m.rulersFrom}</div>
        <Segmented
          label={m.horizontalOrigin}
          value={settings.rulerOrigin.x}
          onChange={(x) =>
            onSettings({ rulerOrigin: { ...settings.rulerOrigin, x } })
          }
          options={[
            ['left', m.edges.left],
            ['right', m.edges.right],
          ]}
        />
        <Segmented
          label={m.verticalOrigin}
          value={settings.rulerOrigin.y}
          onChange={(y) =>
            onSettings({ rulerOrigin: { ...settings.rulerOrigin, y } })
          }
          options={[
            ['top', m.edges.top],
            ['bottom', m.edges.bottom],
          ]}
        />
      </div>
      <div className="de-form-section">
        <div className="de-form-section-title">{m.pageOffsets}</div>
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
                    [edge]: Math.max(
                      0,
                      Math.round(Number(e.target.value) || 0)
                    ),
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
};

export const CanvasSettings = (props: SettingsProps) => {
  const m = useMessages().toolbar;
  return (
    <Popover content={<SettingsContent {...props} />} placement="bottom">
      <button aria-label={m.settings} className="de-tool-btn" type="button">
        <Settings size={18} />
      </button>
    </Popover>
  );
};
