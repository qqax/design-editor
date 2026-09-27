import { clsx } from 'clsx';

import type React from 'react';

export interface SegmentedProps<T extends string> {
  /** Accessible name of the group */
  label: string;
  value: T;
  options: readonly (readonly [T, React.ReactNode])[];
  onChange: (value: T) => void;
  className?: string;
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      aria-label={label}
      className={clsx('de-segmented', className)}
      role="radiogroup"
    >
      {options.map(([option, text]) => (
        <button
          key={option}
          aria-checked={value === option}
          className="de-segment"
          onClick={() => onChange(option)}
          role="radio"
          type="button"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
