'use client';

import * as React from 'react';

export const PBtn = React.forwardRef<HTMLButtonElement, any>(
  ({ active, danger, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        style={{
          width: 30,
          height: 30,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: danger
            ? 'rgba(239, 68, 68, 0.1)'
            : active
              ? 'rgba(37, 99, 235, 0.15)'
              : 'transparent',
          color: danger
            ? '#ef4444'
            : active
              ? 'var(--color-primary, #2563eb)'
              : 'inherit',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          ...props.style,
        }}
      />
    );
  }
);
PBtn.displayName = 'PBtn';

export function PDivider(props: any) {
  return <hr {...props} />;
}
export function HDivider(props: any) {
  return <hr {...props} />;
}
