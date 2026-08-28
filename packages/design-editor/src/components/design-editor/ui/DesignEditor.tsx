import React from 'react';

import {EditorContextProvider} from '../../EditorContext'
import {Provider as EngineProvider,} from '../../../engine/react';
import {Toaster} from 'sonner'
import {
  createDefaultFontProvider,
  createDefaultTemplateProvider,
  createDefaultTextDesignProvider,
  createImglyBackgroundRemoval,
  createLocalStoragePersistence,
} from '../../../providers';
import {DesignEditorProps} from "../model";
import {DesignEditorInner} from "./DesignEditorInner";

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
  templateProvider = createDefaultTemplateProvider(),
  textDesignProvider = createDefaultTextDesignProvider(),
  fontProvider = createDefaultFontProvider(),
  backgroundRemovalProvider,
  persistenceProvider = createLocalStoragePersistence(),
  className,
  templatesPanel,
  libraryPanel,
  title,
}: DesignEditorProps) {
  const resolvedBackgroundRemovalProvider =
    backgroundRemovalProvider ?? createImglyBackgroundRemoval();
  const ctx = React.useMemo(
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
