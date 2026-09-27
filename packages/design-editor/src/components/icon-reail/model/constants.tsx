import { LayoutTemplate, Shapes, Smile, Type, Upload } from 'lucide-react';

import { createLocalGalleryProvider } from '../../../providers';
import {
  createDefaultDesignProvider,
  TEMPLATES_BUNDLE_JSON,
  TEXT_BUNDLE_JSON,
} from '../../panels';

import type { PanelKey, PanelsConfigType } from '../../panels';

/** Rail order; labels come from `messages.rail` */
export const ICONS: { key: PanelKey; icon: React.ReactNode }[] = [
  { key: 'upload', icon: <Upload size={20} /> },
  { key: 'text', icon: <Type size={20} /> },
  { key: 'shapes', icon: <Shapes size={20} /> },
  { key: 'stickers', icon: <Smile size={20} /> },
  { key: 'templates', icon: <LayoutTemplate size={20} /> },
];

export const DEFAULT_GALLERY_PROVIDER = createLocalGalleryProvider();

export const DEFAULT_PANELS_CONFIG: PanelsConfigType = {
  templates: {
    showPanel: true,
    provider: createDefaultDesignProvider(TEMPLATES_BUNDLE_JSON),
    renderProp: undefined,
  },
  text: {
    showPanel: true,
    provider: createDefaultDesignProvider(TEXT_BUNDLE_JSON),
    renderProp: undefined,
  },
  shapes: {
    showPanel: true,
    provider: undefined,
    renderProp: undefined,
  },
  stickers: {
    showPanel: true,
    provider: undefined,
    renderProp: undefined,
  },
  upload: {
    showPanel: true,
    provider: DEFAULT_GALLERY_PROVIDER,
    renderProp: undefined,
  },
  // elements: { showPanel: false },
};
