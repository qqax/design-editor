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
  <div data-canvas-overlay className="de-rail" data-side={side}>
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
