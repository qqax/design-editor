'use client';

import React, { useState } from 'react';

import {
  Component,
  LayoutTemplate,
  Shapes,
  Smile,
  Type,
  Upload,
} from 'lucide-react';

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
      className="z-10 flex h-[66px] w-full shrink-0 flex-row items-center gap-[3px] overflow-x-auto px-[10px] py-[4px] md:h-auto md:w-[62px] md:flex-col md:overflow-visible md:px-0 md:py-[10px]"
      style={{
        background: 'color-mix(in srgb, var(--color-surface) 96%, transparent)',
        borderRight: '1px solid var(--color-border)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 20px var(--shadow-color)',
      }}
    >
      {ICONS.map(({ key, icon, label }) => (
        <RailButton
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

function RailButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <button
      className="relative flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-none outline-none transition-all duration-200"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 54,
        padding: '8px 0',
        gap: 4,
        background: active
          ? 'color-mix(in srgb, var(--color-primary) 18%, transparent)'
          : hov
            ? 'color-mix(in srgb, var(--color-text) 5%, transparent)'
            : 'transparent',
        color: active
          ? 'var(--color-primary)'
          : hov
            ? 'var(--color-text)'
            : 'var(--color-text-muted)',
        fontSize: 18,
        boxShadow: active
          ? '0 0 0 1px var(--color-primary)'
          : hov
            ? '0 0 0 1px var(--color-border)'
            : 'none',
        transform: active ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <span
        style={{
          fontSize: 17,
          transition: 'filter 0.2s',
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          opacity: active ? 1 : 0.7,
        }}
      >
        {label}
      </span>
      {/* Active indicator dot */}
      {active ? (
        <div
          className="absolute left-1/2 top-[-4px] h-[3px] w-[22px] -translate-x-1/2 rounded-b-sm md:left-auto md:right-[-1px] md:top-1/2 md:h-[22px] md:w-[3px] md:-translate-x-0 md:-translate-y-1/2 md:rounded-b-none md:rounded-l-sm"
          style={{
            background: 'var(--color-primary)',
          }}
        />
      ) : null}
    </button>
  );
}
