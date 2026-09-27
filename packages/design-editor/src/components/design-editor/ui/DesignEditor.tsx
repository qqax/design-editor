import React, { useMemo } from 'react';

import { Toaster } from 'sonner';

import { DesignEditorInner } from './DesignEditorInner';
import { fontLoader } from '../../../engine';
import { Provider as EngineProvider } from '../../../engine/react';
import {
  createDefaultFontProvider,
  createImglyBackgroundRemoval,
  createIndexedDBPersistence,
} from '../../../providers';
import { EditorContextProvider } from '../../EditorContext';
import {
  DEFAULT_GALLERY_PROVIDER,
  DEFAULT_PANELS_CONFIG,
} from '../../icon-reail/model';

import type { PanelsConfigType } from '../../panels';
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
  persistenceProvider,

  title,

  panelsConfig,
  adSizes,

  className,
}: DesignEditorProps) {
  const resolvedBackgroundRemovalProvider =
    backgroundRemovalProvider ?? createImglyBackgroundRemoval();
  const innerConfig: PanelsConfigType = {
    templates: {
      ...DEFAULT_PANELS_CONFIG.templates,
      ...panelsConfig?.templates,
    },
    text: { ...DEFAULT_PANELS_CONFIG.text, ...panelsConfig?.text },
    shapes: { ...DEFAULT_PANELS_CONFIG.shapes, ...panelsConfig?.shapes },
    stickers: { ...DEFAULT_PANELS_CONFIG.stickers, ...panelsConfig?.stickers },
    upload: { ...DEFAULT_PANELS_CONFIG.upload, ...panelsConfig?.upload },
  };
  const templateProvider = innerConfig.templates.provider;
  const textDesignProvider = innerConfig.text.provider;
  const templatesPanel = innerConfig.templates.renderProp;
  const libraryPanel = innerConfig.upload.renderProp;
  const galleryProvider =
    innerConfig.upload.provider ?? DEFAULT_GALLERY_PROVIDER;
  const galleryWidget = innerConfig.upload.widget;

  // Registered during render rather than in an effect: child effects (the
  // initial scene import) run before parent effects and would beat it. There
  // is deliberately no unmount teardown — StrictMode's simulated unmount would
  // clear the resolver after this call and leave it null. A later editor
  // overwrites it here instead.
  fontLoader.setResolver(async (family) => fontProvider.load(family));

  const persistence = useMemo(
    () => persistenceProvider ?? createIndexedDBPersistence(),
    [persistenceProvider]
  );

  const ctx = useMemo(
    () => ({
      templateProvider,
      textDesignProvider,
      fontProvider,
      backgroundRemovalProvider: resolvedBackgroundRemovalProvider,
      persistenceProvider: persistence,
      galleryProvider,
      galleryWidget,
      sceneKey,
      onExport,
      onBack,
    }),
    [
      templateProvider,
      textDesignProvider,
      fontProvider,
      resolvedBackgroundRemovalProvider,
      persistence,
      galleryProvider,
      galleryWidget,
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
          templatesPanel={templatesPanel}
          title={title}
        />
        <Toaster position="bottom-right" />
      </EditorContextProvider>
    </EngineProvider>
  );
}
