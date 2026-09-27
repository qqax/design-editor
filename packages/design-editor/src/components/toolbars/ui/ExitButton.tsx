import React from 'react';

import { ArrowLeft } from 'lucide-react';

interface ExitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hasUnsavedChanges: boolean | undefined;
  onBack: () => void;
}

/** Forwards ref and props so it can be a Dialog trigger (`asChild`). */
export const ExitButton = React.forwardRef<HTMLButtonElement, ExitButtonProps>(
  ({ hasUnsavedChanges, onBack, ...props }, ref) => (
    <button
      ref={ref}
      className="de-tool-btn"
      onClick={hasUnsavedChanges ? undefined : onBack}
      type="button"
      {...props}
    >
      <ArrowLeft size={14} />
      <span className="de-hide-mobile">Exit</span>
    </button>
  )
);
ExitButton.displayName = 'ExitButton';
