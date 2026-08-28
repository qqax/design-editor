'use client';

import { useActiveObject, useObjects } from '../engine/react';

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

export interface LayerItem {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  children?: LayerItem[];
}

function toLayerItem(obj: any): LayerItem {
  const type = String(obj?.type ?? 'Object');
  const id = String(obj?.id);

  const children = Array.isArray(obj?.objects)
    ? obj.objects.map((child: any) => toLayerItem(child))
    : undefined;

  return {
    id,
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

  const layers = [...objects].reverse().map(toLayerItem);

  const activeId = activeObj?.id != null ? String(activeObj.id) : null;

  return {
    layers,
    activeId,
  };
}
