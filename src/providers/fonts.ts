/** Describes a font family available to the editor. */
export interface FontDescriptor {
  family: string;
  source: 'google' | 'custom';
  url?: string;
}

export type FontChangeHandler = () => void;

/**
 * Plug in your own font source. The editor calls `list` to populate the font
 * picker, `load` when the user selects a font, `upload` to add a custom font
 * from a file, and `onChange` to subscribe to updates (e.g. after an upload).
 */
export interface FontProvider {
  /** Return the full list of available fonts. */
  list: () => Promise<FontDescriptor[]>;
  /** Load a font family so it can be rendered on canvas. */
  load: (family: string) => Promise<void>;
  /** Upload a font file and register it as a custom font. */
  upload: (file: File) => Promise<FontDescriptor>;
  /** Subscribe to changes (e.g. new uploads). Returns an unsubscribe function. */
  onChange?: (handler: FontChangeHandler) => () => void;
}
