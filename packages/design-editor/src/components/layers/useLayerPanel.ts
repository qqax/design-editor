'use client';

import { Group } from 'fabric';

import { useActiveObject, useObjects } from '../../engine/react';

import type { FabricObject } from 'fabric';

import type { LayerItem } from './layer-panel.types';

function toLayerItem(object: FabricObject): LayerItem {
  const children =
    object instanceof Group ? object.getObjects().map(toLayerItem) : [];
  const name = typeof object.name === 'string' ? object.name.trim() : '';
  return {
    id: String(object.id),
    type: object.type,
    name: name || object.type,
    visible: object.visible,
    ...(children.length > 0 ? { children } : {}),
  };
}

export function useLayerPanel() {
  const objects = useObjects<FabricObject[] | null>() ?? [];
  const activeObj = useActiveObject<FabricObject | null>();

  return {
    layers: [...objects].reverse().map(toLayerItem),
    activeId: activeObj?.id != null ? String(activeObj.id) : null,
  };
}
