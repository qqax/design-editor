'use client';

import { createContext, useContext } from 'react';

import { en } from './en';

import type { EditorMessages } from './en';

const MessagesContext = createContext<EditorMessages>(en);

export const MessagesProvider = MessagesContext.Provider;

/** Current UI texts; English outside a provider */
export const useMessages = (): EditorMessages => useContext(MessagesContext);
