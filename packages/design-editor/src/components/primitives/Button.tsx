'use client';

import * as React from 'react';

import { clsx } from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'secondary', size = 'md', iconOnly, className, ...rest },
    ref
  ) => (
    <button
      ref={ref}
      data-de-button
      className={clsx('de-btn', className)}
      data-icon-only={iconOnly ? '' : undefined}
      data-size={size}
      data-variant={variant}
      {...rest}
    />
  )
);
Button.displayName = 'Button';
