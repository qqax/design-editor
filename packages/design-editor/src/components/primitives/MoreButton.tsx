'use client';

import * as React from 'react';

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MoreHorizontal,
} from 'lucide-react';

import { PBtn } from './Helpers';

import type { PBtnProps } from './Helpers';

interface MoreButtonProps extends PBtnProps {
  /** Accessible name and tooltip, e.g. "More text options" */
  label: string;
}

/** "⋯" button that opens further options (use as a Popover trigger). */
export const MoreButton = React.forwardRef<HTMLButtonElement, MoreButtonProps>(
  ({ label, ...props }, ref) => (
    <PBtn ref={ref} aria-label={label} title={label} {...props}>
      <MoreHorizontal size={16} />
    </PBtn>
  )
);
MoreButton.displayName = 'MoreButton';

interface MoreLinkProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  /** Omit for a link to another view; true/false for an inline expander */
  expanded?: boolean;
}

/** "See all" / "Show more" link used in panels. */
export function MoreLink({ expanded, children, ...props }: MoreLinkProps) {
  const Icon =
    expanded === undefined ? ChevronRight : expanded ? ChevronUp : ChevronDown;
  return (
    <button
      aria-expanded={expanded}
      className="de-more-link"
      type="button"
      {...props}
    >
      {children}
      <Icon size={12} />
    </button>
  );
}
