import React from 'react';

import { ArrowLeft } from 'lucide-react';

import { useMessages } from '../../../messages';

interface ExitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hasUnsavedChanges: boolean | undefined;
  onBack: () => void;
}

/** Forwards ref and props so it can be a Dialog trigger (`asChild`). */
export const ExitButton = React.forwardRef<HTMLButtonElement, ExitButtonProps>(
  ({ hasUnsavedChanges, onBack, ...props }, ref) => {
    const m = useMessages().toolbar;
    return (
      <button
        ref={ref}
        aria-label={m.exit}
        className="de-tool-btn"
        onClick={hasUnsavedChanges ? undefined : onBack}
        type="button"
        {...props}
      >
        <ArrowLeft size={14} />
        <span className="de-hide-mobile">{m.exit}</span>
      </button>
    );
  }
);

ExitButton.displayName = 'ExitButton';
