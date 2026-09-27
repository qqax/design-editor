'use client';

import * as React from 'react';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';

import { usePortalContainer } from './PortalContainer';

export interface TooltipProps {
  children: React.ReactNode;
  title: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const Tooltip = React.forwardRef<HTMLElement, TooltipProps>(
  ({ children, title, placement = 'top', className }, ref) => {
    const container = usePortalContainer();
    if (!title) return <React.Fragment>{children}</React.Fragment>;
    return (
      <RadixTooltip.Provider delayDuration={200}>
        <RadixTooltip.Root>
          <RadixTooltip.Trigger ref={ref as any} asChild>
            {children}
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal container={container}>
            <RadixTooltip.Content
              className={clsx('de-tooltip-content', className)}
              side={placement}
              sideOffset={4}
            >
              {title}
              <RadixTooltip.Arrow
                className="de-tooltip-arrow"
                height={4}
                width={8}
              />
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    );
  }
);
