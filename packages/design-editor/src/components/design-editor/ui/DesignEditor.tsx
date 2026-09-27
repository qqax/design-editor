import React, { useMemo } from 'react';

import { DesignEditorInner } from './DesignEditorInner';
import { EXPORT_FORMATS } from '../../../engine';
import { Provider as EngineProvider } from '../../../engine/react';
import { en, mergeMessages, MessagesProvider } from '../../../messages';
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

import type { ExportFormat } from '../../../engine';
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
  exportFormats,

  fontProvider: fontProviderProp,
  backgroundRemovalProvider,
  persistenceProvider,

  title,

  panelsConfig,
  adSizes,

  className,
  theme = 'dark',
  appearance,
  messages: messagesProp,
}: DesignEditorProps) {
  const fontProvider = useMemo(
    () => fontProviderProp ?? createDefaultFontProvider(),
    [fontProviderProp]
  );
  const resolvedBackgroundRemovalProvider = useMemo(
    () => backgroundRemovalProvider ?? createImglyBackgroundRemoval(),
    [backgroundRemovalProvider]
  );
  const messages = useMemo(
    () => mergeMessages(en, messagesProp),
    [messagesProp]
  );
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

  // Keyed by content: a new array with the same formats keeps the context.
  const formatsKey = exportFormats?.join(',') ?? '';
  const formats = useMemo(
    () =>
      formatsKey
        ? [...new Set(formatsKey.split(',') as ExportFormat[])]
        : (Object.keys(EXPORT_FORMATS) as ExportFormat[]),
    [formatsKey]
  );

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
      exportFormats: formats,
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
      formats,
      onBack,
    ]
  );

  return (
    <MessagesProvider value={messages}>
      <EngineProvider>
        <EditorContextProvider value={ctx}>
          <DesignEditorInner
            adSizes={adSizes}
            appearance={appearance}
            className={className}
            initialScene={initialScene}
            libraryPanel={libraryPanel}
            panelsConfig={innerConfig}
            templatesPanel={templatesPanel}
            theme={theme}
            title={title}
          />
        </EditorContextProvider>
      </EngineProvider>
    </MessagesProvider>
  );
}
