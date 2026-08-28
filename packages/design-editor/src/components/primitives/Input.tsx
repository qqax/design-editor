'use client';

import * as React from 'react';

import { clsx } from 'clsx';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: 'sm' | 'md' | 'lg';
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = 'md', ...rest }, ref) => (
    <input
      ref={ref}
      className={clsx('de-input', className)}
      data-size={size}
      {...rest}
    />
  )
);
Input.displayName = 'Input';
