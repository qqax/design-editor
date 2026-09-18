import { LayoutTemplate, Shapes, Smile, Type, Upload } from 'lucide-react';

import {
  createDefaultDesignProvider,
  TEMPLATES_BUNDLE_JSON,
  TEXT_BUNDLE_JSON,
} from '../../panels';

import type { PanelKey, PanelsConfigType } from '../../panels';

export const ICONS: { key: PanelKey; icon: React.ReactNode; label: string }[] =
  [
    // { key: 'elements', icon: <Component size={20} />, label: 'Elements' },
    { key: 'upload', icon: <Upload size={20} />, label: 'Upload' },
    { key: 'text', icon: <Type size={20} />, label: 'Text' },
    { key: 'shapes', icon: <Shapes size={20} />, label: 'Shapes' },
    { key: 'stickers', icon: <Smile size={20} />, label: 'Stickers' },
    {
      key: 'templates',
      icon: <LayoutTemplate size={20} />,
      label: 'Templates',
    },
  ];

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
    provider: undefined,
    renderProp: undefined,
  },
  // elements: { showPanel: false },
};
