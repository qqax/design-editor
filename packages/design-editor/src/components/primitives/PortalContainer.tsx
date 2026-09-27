'use client';

import { createContext, useContext } from 'react';

const PortalContainerContext = createContext<HTMLElement | null>(null);

/** Popovers, tooltips, selects and dialogs render into this element. */
export const PortalContainerProvider = PortalContainerContext.Provider;

export const usePortalContainer = () =>
  useContext(PortalContainerContext) ?? undefined;
