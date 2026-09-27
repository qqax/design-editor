import { Color } from 'fabric';

import { LayerType } from '../../../engine';

import type { ILayer, IStaticPath } from '../../../engine';
import type { DesignResource } from '../../panels/common/provider';

interface Size {
  width: number;
  height: number;
}

const isVisibleColor = (color: string | undefined): color is string => {
  if (!color) return false;
  const parsed = new Color(color);
  return !parsed.isUnrecognised && parsed.getAlpha() > 0;
};

/**
 * Layers to add for a text design, centred on the page. The design's canvas
 * colour becomes a backdrop rectangle, so white text designed for a dark
 * canvas does not vanish on a white page.
 */
export function buildTextDesignLayers(
  design: Pick<DesignResource, 'scene' | 'canvasBg'>,
  page: Size,
  createId: () => string,
  backdropName = 'Backdrop'
): Partial<ILayer>[] {
  const { frame, layers } = design.scene;
  const dx = (page.width - frame.width) / 2;
  const dy = (page.height - frame.height) / 2;

  const pageBackground = layers.find(
    (layer) => layer.type === LayerType.BACKGROUND
  );
  const pageFill =
    pageBackground && 'fill' in pageBackground
      ? pageBackground.fill
      : undefined;
  const backdropFill =
    design.canvasBg ?? (typeof pageFill === 'string' ? pageFill : undefined);

  const content = layers
    .filter((layer) => layer.type !== LayerType.BACKGROUND)
    .map((layer) => ({
      ...layer,
      id: createId(),
      left: (layer.left ?? 0) + dx,
      top: (layer.top ?? 0) + dy,
    }));

  if (!isVisibleColor(backdropFill)) return content;

  const { width, height } = frame;
  const backdrop: IStaticPath = {
    id: createId(),
    name: backdropName,
    type: LayerType.STATIC_PATH,
    left: dx,
    top: dy,
    width,
    height,
    fill: backdropFill,
    path: [
      ['M', 0, 0],
      ['L', width, 0],
      ['L', width, height],
      ['L', 0, height],
      ['Z'],
    ],
  };

  return [backdrop, ...content];
}
