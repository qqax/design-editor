import React, { useMemo } from 'react';

import { Toaster } from 'sonner';

import { DesignEditorInner } from './DesignEditorInner';
import { Provider as EngineProvider } from '../../../engine/react';
import {
  createDefaultFontProvider,
  createImglyBackgroundRemoval,
  createLocalStoragePersistence,
} from '../../../providers';
import { EditorContextProvider } from '../../EditorContext';
import { DEFAULT_PANELS_CONFIG } from '../../icon-reail/model';

import type { DesignEditorProps } from '../model';

/**
 * The top-level image design editor. Renders a full-screen canvas-based editor
 * with toolbar, side panels, layer panel, and object properties bar.
 *
 * Configure host integration via the provider props
 * (`templateProvider`, `fontProvider`, `backgroundRemovalProvider`, `persistenceProvider`).
 *
 * @example
 * ```tsx
 * import { DesignEditor } from '@qqax/design-editor'
 * import '@qqax/design-editor/theme.css'
 *
 * export default function App() {
 *   return <DesignEditor />
 * }
 * ```
 */
export function DesignEditor({
  initialScene,
  sceneKey,
  onBack,
  onExport,

  fontProvider = createDefaultFontProvider(),
  backgroundRemovalProvider,
  persistenceProvider = createLocalStoragePersistence(),

  title,

  panelsConfig,
  adSizes,

  className,
}: DesignEditorProps) {
  const resolvedBackgroundRemovalProvider =
    backgroundRemovalProvider ?? createImglyBackgroundRemoval();
  const innerConfig = { ...DEFAULT_PANELS_CONFIG, ...panelsConfig };
  const templateProvider = innerConfig.templates.provider;
  const textDesignProvider = innerConfig.text.provider;
  const templatesPanel = innerConfig.templates.renderProp;
  const libraryPanel = innerConfig.upload.renderProp;

  const ctx = useMemo(
    () => ({
      templateProvider,
      textDesignProvider,
      fontProvider,
      backgroundRemovalProvider: resolvedBackgroundRemovalProvider,
      persistenceProvider,
      sceneKey,
      onExport,
      onBack,
    }),
    [
      templateProvider,
      textDesignProvider,
      fontProvider,
      resolvedBackgroundRemovalProvider,
      persistenceProvider,
      sceneKey,
      onExport,
      onBack,
    ]
  );

  return (
    <EngineProvider>
      <EditorContextProvider value={ctx}>
        <DesignEditorInner
          adSizes={adSizes}
          className={className}
          initialScene={initialScene}
          libraryPanel={libraryPanel}
          onBack={onBack}
          templatesPanel={templatesPanel}
          textDesignProvider={textDesignProvider}
          title={title}
        />
        <Toaster position="bottom-right" />
      </EditorContextProvider>
    </EngineProvider>
  );
}
