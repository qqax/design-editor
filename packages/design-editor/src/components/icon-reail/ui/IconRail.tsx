'use client';

import React from 'react';

import { IconRailButton } from './IconRailButton';
import { DEFAULT_PANELS_CONFIG, ICONS } from '../model';

import type { PanelKey, PanelsConfigType } from '../../panels';

interface Props {
  activePanel: PanelKey | null;
  onTogglePanel: (key: PanelKey) => void;
  side?: 'left' | 'right';
  panelsConfig?: PanelsConfigType;
}

export const IconRail = ({
  activePanel,
  onTogglePanel,
  panelsConfig = DEFAULT_PANELS_CONFIG,
  side = 'left',
}: Props) => (
  <div
    className="z-10 flex h-16.5 w-full shrink-0 flex-row items-center gap-1 overflow-x-auto px-3 py-1 md:h-auto md:w-16 md:flex-col md:overflow-visible md:px-0 md:py-3"
    style={{
      background:
        'color-mix(in srgb, var(--de-color-surface) 96%, transparent)',
      borderRight:
        side === 'left' ? '1px solid var(--de-color-border)' : 'none',
      borderLeft:
        side === 'right' ? '1px solid var(--de-color-border)' : 'none',
      boxShadow:
        side === 'left'
          ? '0 -4px 20px var(--shadow-color)'
          : '0 4px 20px var(--shadow-color)',
      position: 'absolute',
      [side]: 0,
      top: 0,
      bottom: 0,
    }}
  >
    {ICONS.filter(({ key }) => panelsConfig[key].showPanel).map(
      ({ key, icon, label }) => (
        <IconRailButton
          key={key}
          active={activePanel === key}
          icon={icon}
          label={label}
          onClick={() => onTogglePanel(key)}
        />
      )
    )}
  </div>
);
