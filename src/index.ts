/**
 * @fastlabai/design-editor
 *
 * An open-source image design editor for React and Next.js.
 * Plug into your own media library, fonts, and storage backend via simple
 * provider interfaces.
 *
 * @packageDocumentation
 */

/** Current package version. */
export const VERSION = '1.0.0-beta.10';

export * from './providers';
export * from './components/DesignEditor';

/** Re-export the engine's public types for consumers who need to interact with scenes/layers. */
export type { ILayer, IScene } from './engine';
