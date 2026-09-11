import React from 'react';

import { Settings } from 'lucide-react';

import { TOOL_BTN } from '../panels/color-picker';
import { Popover, Switch } from '../primitives';

interface SettingsProps {
  settings: Record<string, any>;
  onSettings: (s: Record<string, any>) => void;
}

const SettingsContent = ({ settings, onSettings }: SettingsProps) => (
  <div
    style={{
      width: 230,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      background: 'var(--de-color-surface)',
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
    {[
      { label: 'Grid overlay', key: 'showGrid' as const },
      { label: 'Snap to grid', key: 'snapGrid' as const },
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
    <div
      style={{
        borderTop: '1px solid var(--de-color-border)',
        paddingTop: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: 'var(--de-color-text-muted)',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        Panel Rail
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['left', 'right'] as const).map((side) => (
          <button
            key={side}
            onClick={() => onSettings({ railSide: side })}
            type="button"
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: 8,
              cursor: 'pointer',
              border:
                settings.railSide === side
                  ? '1.5px solid var(--de-color-primary)'
                  : '1px solid var(--de-color-border)',
              background:
                settings.railSide === side
                  ? 'color-mix(in srgb, var(--de-color-primary) 18%, transparent)'
                  : 'color-mix(in srgb, var(--de-color-text) 3%, transparent)',
              color:
                settings.railSide === side
                  ? 'var(--de-color-primary)'
                  : 'var(--de-color-text-muted)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'capitalize',
              outline: 'none',
            }}
          >
            {side}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export const CanvasSettings = ({ settings, onSettings }: SettingsProps) => (
  <Popover
    content={<SettingsContent onSettings={onSettings} settings={settings} />}
    placement="bottom"
  >
    <button style={TOOL_BTN} type="button">
      <Settings size={18} />
    </button>
  </Popover>
);
