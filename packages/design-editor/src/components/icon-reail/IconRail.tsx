'use client';

import React from 'react';

import {
  Component,
  LayoutTemplate,
  Shapes,
  Smile,
  Type,
  Upload,
} from 'lucide-react';

import { IconRailButton } from './IconRailButton';

export type PanelKey =
  'templates' | 'elements' | 'upload' | 'text' | 'shapes' | 'stickers';

const ICONS: { key: PanelKey; icon: React.ReactNode; label: string }[] = [
  { key: 'templates', icon: <LayoutTemplate size={20} />, label: 'Templates' },
  { key: 'elements', icon: <Component size={20} />, label: 'Elements' },
  { key: 'upload', icon: <Upload size={20} />, label: 'Upload' },
  { key: 'text', icon: <Type size={20} />, label: 'Text' },
  { key: 'shapes', icon: <Shapes size={20} />, label: 'Shapes' },
  { key: 'stickers', icon: <Smile size={20} />, label: 'Stickers' },
];

interface Props {
  activePanel: PanelKey | null;
  onTogglePanel: (key: PanelKey) => void;
}

export function IconRail({ activePanel, onTogglePanel }: Props) {
  return (
    <div
      className="z-10 flex h-[66px] w-full shrink-0 flex-row items-center gap-1 overflow-x-auto px-3 py-1 md:h-auto md:w-16 md:flex-col md:overflow-visible md:px-0 md:py-3"
      style={{
        background: 'color-mix(in srgb, var(--de-color-surface) 96%, transparent)',
        borderRight: '1px solid var(--de-color-border)',
        borderTop: '1px solid var(--de-color-border)',
        boxShadow: '0 -4px 20px var(--shadow-color)',
      }}
    >
      {ICONS.map(({ key, icon, label }) => (
        <IconRailButton
          key={key}
          active={activePanel === key}
          icon={icon}
          label={label}
          onClick={() => onTogglePanel(key)}
        />
      ))}
    </div>
  );
}
