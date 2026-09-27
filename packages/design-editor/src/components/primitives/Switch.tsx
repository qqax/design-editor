import * as React from 'react';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { clsx } from 'clsx';

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={clsx('de-switch', className)}
    {...props}
  >
    <SwitchPrimitive.Thumb className="de-switch-thumb" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
