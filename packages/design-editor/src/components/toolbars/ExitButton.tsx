import React from 'react';

import { ArrowLeft } from 'lucide-react';

interface ExitButtonProps {
  hasUnsavedChanges: boolean | undefined;
  onBack: () => void;
}

export const ExitButton = ({ hasUnsavedChanges, onBack }: ExitButtonProps) => (
  <button
    onClick={!hasUnsavedChanges ? onBack : undefined}
    type="button"
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--de-color-text)';
      e.currentTarget.style.background =
        'color-mix(in srgb, var(--de-color-text) 10%, transparent)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'var(--color-text-muted)';
      e.currentTarget.style.background =
        'color-mix(in srgb, var(--color-text) 5%, transparent)';
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      background: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
      border: '1px solid var(--color-border)',
      borderRadius: 9,
      padding: '6px 13px',
      cursor: 'pointer',
      color: 'var(--color-text-muted)',
      fontSize: 12,
      fontWeight: 600,
      transition: 'all 0.15s',
      outline: 'none',
    }}
  >
    <ArrowLeft size={14} /> <span className="hidden md:inline">Exit</span>
  </button>
);
