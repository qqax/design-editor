import type React from 'react';

export interface GalleryItem {
  id: string;
  url: string;
  /** Smaller image for the panel grid; `url` is used when omitted */
  thumbnailUrl?: string;
  name?: string;
  type?: 'image' | 'video';
}

/**
 * Media gallery shown in the Upload panel. The default provider keeps uploads
 * in IndexedDB; supply your own to use an external gallery.
 */
export interface GalleryProvider {
  /** Items to show, newest first. */
  list: () => Promise<GalleryItem[]>;
  /** Store a file picked in the panel; without it the upload button is hidden. */
  upload?: (file: File) => Promise<GalleryItem>;
  /** Delete an item; without it the delete buttons are hidden. */
  remove?: (id: string) => Promise<void>;
  /** Called when items change outside the editor, e.g. through a widget. */
  subscribe?: (onChange: () => void) => () => void;
}

export interface GalleryWidgetApi {
  /** Reload the gallery, e.g. after the widget added an image. */
  refresh: () => void;
  /** Put an image or video on the canvas. */
  addToCanvas: (url: string) => void;
}

/** Any host-made UI rendered at the top of the Upload panel. */
export type GalleryWidget = (api: GalleryWidgetApi) => React.ReactNode;
