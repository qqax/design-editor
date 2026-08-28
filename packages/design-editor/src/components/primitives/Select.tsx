'use client';

import * as React from 'react';

import * as RadixSelect from '@radix-ui/react-select';
import { clsx } from 'clsx';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      options,
      placeholder,
      className,
      style,
    },
    ref
  ) => {
    return (
      <RadixSelect.Root
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        value={value}
      >
        <RadixSelect.Trigger
          ref={ref}
          className={clsx('de-select-trigger', className)}
          style={style}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <svg
              fill="none"
              height="15"
              viewBox="0 0 15 15"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819L7.43179 8.56819C7.60753 8.74393 7.89245 8.74393 8.06819 8.56819L10.5682 6.06819C10.7439 5.89245 10.7439 5.60753 10.5682 5.43179C10.3924 5.25605 10.1075 5.25605 9.93179 5.43179L7.75 7.61358L5.56819 5.43179C5.39245 5.25605 5.10753 5.25605 4.93179 5.43179Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className="de-select-content"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="de-select-viewport">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  className="de-select-item"
                  value={option.value}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="de-select-item-indicator">
                    <svg
                      fill="none"
                      height="15"
                      viewBox="0 0 15 15"
                      width="15"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    );
  }
);
