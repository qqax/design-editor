import type React from 'react';

import type { EditorAppearance, EditorTheme } from './appearance';
import type { CanvasBackground, ExportFormat, IScene } from '../../../engine';
import type { EditorMessagesOverride } from '../../../messages';
import type {
  BackgroundRemovalProvider,
  FontProvider,
  PersistenceProvider,
} from '../../../providers';
import type { PanelsConfigType } from '../../panels';
import type { SelectOptions } from '../../primitives';

/** Page and workspace colours that may travel with a scene */
export interface SceneColors {
  canvasBg?: CanvasBackground;
  workspaceBg?: string;
}

/** A scene, or a design resource wrapping one (`{ scene, canvasBg }`) */
export type InitialScene =
  (IScene & SceneColors) | ({ scene: IScene } & SceneColors);

/** Props for the top-level {@link DesignEditor} component. */
export interface DesignEditorProps {
  /** Scene to load on mount when there is no autosave; may carry `canvasBg`/`workspaceBg`. */
  initialScene?: InitialScene;
  /** Stable key identifying the scene for persistence; passed to the persistence provider. */
  sceneKey?: string;
  /** Called when the user clicks the back button in the toolbar. */
  onBack?: () => void;
  /**
   * "Save to library" in the Export dialog: receives the rendered file, its
   * format and the scene JSON. Without it the dialog only offers Download.
   * A handler typed for fewer formats is accepted; list them in
   * `exportFormats` so the dialog offers only those.
   */
  // Method syntax keeps the parameters bivariant, so narrower handlers type-check.
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  onExport?(
    blob: Blob,
    format: ExportFormat,
    scene: IScene
  ): void | Promise<void>;
  /** Formats offered in the Export dialog, in this order. Defaults to all. */
  exportFormats?: readonly ExportFormat[];
  /** Font provider. Defaults to a Google Fonts provider. */
  fontProvider?: FontProvider;
  /** Background removal provider. Defaults to `@imgly/background-removal` if installed. */
  backgroundRemovalProvider?: BackgroundRemovalProvider;
  /** Autosave/scene persistence provider. Defaults to an IndexedDB provider. */
  persistenceProvider?: PersistenceProvider;
  /** Optional className applied to the editor root for outer styling. */
  className?: string;
  /** Initial built-in theme; users can switch it unless `appearance.colors` is set. */
  theme?: EditorTheme;
  /** UI colors and fonts; with `colors` the Dark/Light switcher is hidden. */
  appearance?: EditorAppearance;
  /**
   * UI texts. Any subset of the English `defaultMessages`; missing entries
   * fall back to English. Functions receive the values they interpolate.
   * A complete Russian set is exported as `ruMessages`.
   */
  messages?: EditorMessagesOverride;
  /** Optional title to display in the toolbar. Defaults to "Design Studio". */
  title?: React.ReactNode;
  adSizes?: SelectOptions;
  /** Per panel; only the given fields override the defaults */
  panelsConfig?: {
    [K in keyof PanelsConfigType]?: Partial<PanelsConfigType[K]>;
  };
}
