'use client';

import { createContext, useContext } from 'react';

import type {
  BackgroundRemovalProvider,
  FontProvider,
  PersistenceProvider,
} from '../providers';
import type { ResourceProvider } from './panels/common/provider';

export interface EditorContextValue {
  fontProvider: FontProvider;
  backgroundRemovalProvider: BackgroundRemovalProvider;
  persistenceProvider: PersistenceProvider;
  templateProvider: ResourceProvider;
  textDesignProvider: ResourceProvider;
  sceneKey?: string;
  onExport?: (
    blob: Blob,
    format: 'png' | 'jpg' | 'svg',
    scene: any
  ) => void | Promise<void>;
  onBack?: () => void;
}

const Context = createContext<EditorContextValue | null>(null);
export function useEditorContext() {
  const v = useContext(Context);
  if (!v)
    throw new Error('useEditorContext must be used inside <DesignEditor>');
  return v;
}
export const EditorContextProvider = Context.Provider;
