'use client';

import { useActiveObject, useObjects } from '../../engine/react';

import type { LayerItem } from './layer-panel.types';

const TYPE_LABELS: Record<string, string> = {
  StaticImage: 'Image',
  BackgroundImage: 'Image',
  StaticText: 'Text',
  DynamicText: 'Text',
  StaticVideo: 'Video',
  StaticPath: 'Shape',
  StaticVector: 'Shape',
  Group: 'Group',
};

function toLayerItem(obj: any): LayerItem {
  const type = String(obj?.type ?? 'Object');
  const children = Array.isArray(obj?.objects)
    ? obj.objects.map((c: any) => toLayerItem(c))
    : undefined;

  return {
    id: String(obj?.id),
    type,
    name:
      typeof obj?.name === 'string' && obj.name.trim()
        ? obj.name
        : (TYPE_LABELS[type] ?? 'Object'),
    visible: obj?.visible !== false,
    ...(children && children.length > 0 ? { children } : {}),
  };
}

export function useLayerPanel() {
  const objects = useObjects<any[]>() ?? [];
  const activeObj = useActiveObject();

  return {
    layers: [...objects].reverse().map(toLayerItem),
    activeId: activeObj?.id != null ? String(activeObj.id) : null,
  };
}
