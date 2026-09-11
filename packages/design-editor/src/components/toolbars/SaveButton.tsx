import React from 'react';

import { Save } from 'lucide-react';

interface SaveButtonProps {
  exporting: boolean;
  onExport: () => void;
}

export const SaveButton = ({ exporting, onExport }: SaveButtonProps) => (
  <button
    disabled={exporting}
    onClick={onExport}
    type="button"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: exporting
        ? 'color-mix(in srgb, var(--de-color-primary) 30%, transparent)'
        : 'var(--de-color-primary)',
      border: 'none',
      borderRadius: 10,
      padding: '8px 20px',
      color: 'var(--de-color-primary-fg)',
      fontWeight: 700,
      fontSize: 13,
      cursor: exporting ? 'wait' : 'pointer',
      boxShadow: exporting
        ? 'none'
        : '0 0 20px color-mix(in srgb, var(--de-color-primary) 35%, transparent), 0 4px 12px var(--shadow-color)',
      transition: 'all 0.2s',
      letterSpacing: '-0.01em',
      outline: 'none',
    }}
  >
    <Save size={16} />
    <span className="hidden md:inline">
      {exporting ? 'Saving…' : 'Save to Library'}
    </span>
    <span className="md:hidden">{exporting ? '…' : 'Save'}</span>
  </button>
);
