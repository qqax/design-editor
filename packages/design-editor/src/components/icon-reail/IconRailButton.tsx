'use client';

import React, { useState } from 'react';

export function IconRailButton({
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
      type="button"
      style={{
        width: 54,
        padding: '8px 0',
        gap: 4,
        background: active
          ? 'color-mix(in srgb, var(--de-color-primary) 18%, transparent)'
          : hov
            ? 'color-mix(in srgb, var(--de-color-text) 5%, transparent)'
            : 'transparent',
        color: active
          ? 'var(--de-color-primary)'
          : hov
            ? 'var(--de-color-text)'
            : 'var(--de-color-text-muted)',
        fontSize: 18,
        boxShadow: active
          ? '0 0 0 1px var(--de-color-primary)'
          : hov
            ? '0 0 0 1px var(--de-color-border)'
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
    </button>
  );
}
