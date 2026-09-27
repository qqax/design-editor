'use client';

import React from 'react';

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
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className="de-rail-btn"
      data-active={active}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span className="de-rail-label">{label}</span>
    </button>
  );
}
