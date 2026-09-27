'use client';

import * as React from 'react';

import { clsx } from 'clsx';

export interface PBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  danger?: boolean;
}

/** Square icon button used in toolbars and the properties bar. */
export const PBtn = React.forwardRef<HTMLButtonElement, PBtnProps>(
  (
    { active = false, danger = false, className, type = 'button', ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={clsx('de-icon-btn', className)}
      data-active={active}
      data-danger={danger}
      // eslint-disable-next-line react/button-has-type -- forwarded from props, defaults to "button"
      type={type}
      {...props}
    />
  )
);
PBtn.displayName = 'PBtn';

/** Vertical separator between groups of controls. */
export function PDivider({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx('de-divider-v', className)}
      role="presentation"
    />
  );
}

export const HDivider = PDivider;
