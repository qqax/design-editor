import type React from 'react';

import type { IScene } from '../../../engine';
import type {
  BackgroundRemovalProvider,
  FontProvider,
  PersistenceProvider,
} from '../../../providers';
import type { PanelsConfigType } from '../../panels';
import type { SelectOptions } from '../../primitives';

/** Props for the top-level {@link DesignEditor} component. */
export interface DesignEditorProps {
  /** A serialized scene to load on mount, or any scene-shaped object with optional `canvasBg`/`workspaceBg`. */
  initialScene?: IScene | any;
  /** Stable key identifying the scene for persistence; passed to the persistence provider. */
  sceneKey?: string;
  /** Called when the user clicks the back button in the toolbar. */
  onBack?: () => void;
  /** Called when the user exports the design. Receives the rendered Blob, output format, and raw scene JSON. */
  onExport?: (
    blob: Blob,
    format: 'png' | 'jpg' | 'svg',
    scene: IScene
  ) => void | Promise<void>;
  /** Font provider. Defaults to a Google Fonts provider. */
  fontProvider?: FontProvider;
  /** Background removal provider. Defaults to `@imgly/background-removal` if installed. */
  backgroundRemovalProvider?: BackgroundRemovalProvider;
  /** Autosave/scene persistence provider. Defaults to a `localStorage` provider. */
  persistenceProvider?: PersistenceProvider;
  /** Optional className applied to the editor root for outer styling. */
  className?: string;
  /** Optional title to display in the toolbar. Defaults to "Design Studio". */
  title?: React.ReactNode;
  adSizes?: SelectOptions;
  panelsConfig?: PanelsConfigType;
}
