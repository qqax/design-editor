import React from 'react';

import { Save } from 'lucide-react';

interface SaveButtonProps {
  exporting: boolean;
  onExport: () => void;
}

export const SaveButton = ({ exporting, onExport }: SaveButtonProps) => (
  <button
    className="de-btn"
    data-size="md"
    data-variant="primary"
    disabled={exporting}
    onClick={onExport}
    style={{ cursor: exporting ? 'wait' : undefined }}
    type="button"
  >
    <Save size={15} />
    <span className="de-hide-mobile">
      {exporting ? 'Saving…' : 'Save to Library'}
    </span>
    <span className="de-show-mobile">{exporting ? '…' : 'Save'}</span>
  </button>
);
