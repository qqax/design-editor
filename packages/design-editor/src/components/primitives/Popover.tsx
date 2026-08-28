'use client';

import * as React from 'react';

import * as RadixPopover from '@radix-ui/react-popover';
import { clsx } from 'clsx';

export interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  contentClassName?: string;
}

export function Popover({
  children,
  content,
  open,
  onOpenChange,
  placement = 'bottom',
  contentClassName,
}: PopoverProps) {
  return (
    <RadixPopover.Root onOpenChange={onOpenChange} open={open}>
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={clsx('de-popover-content', contentClassName)}
          side={placement}
          sideOffset={4}
        >
          {content}
          <RadixPopover.Arrow
            className="de-popover-arrow"
            height={5}
            width={10}
          />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
