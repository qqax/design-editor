import React from 'react';

interface BrandProps {
  title: React.ReactNode;
}

export const Brand = ({ title }: BrandProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginLeft: 8,
      marginRight: 4,
    }}
  >
    <span
      className="hidden md:inline"
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--color-text)',
        letterSpacing: '-0.01em',
      }}
    >
      {title || 'Design Studio'}
    </span>
  </div>
);
