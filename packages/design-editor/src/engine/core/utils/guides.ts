export type GuideAxis = 'x' | 'y';

/** A ruler guide; `position` is in frame coordinates (0 = the frame's left/top edge). */
export interface Guide {
  id: string;
  axis: GuideAxis;
  position: number;
}

export interface GuideRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const nearestOffset = (
  anchors: number[],
  positions: number[],
  threshold: number
): number => {
  let best = 0;
  let bestDistance = Infinity;
  positions.forEach((position) => {
    anchors.forEach((anchor) => {
      const offset = position - anchor;
      const distance = Math.abs(offset);
      if (distance <= threshold && distance < bestDistance) {
        best = offset;
        bestDistance = distance;
      }
    });
  });
  return best;
};

/**
 * Offset that puts the nearest edge or centre of `rect` onto a guide, per
 * axis, when one is within `threshold`; 0 otherwise.
 */
export function snapOffset(
  rect: GuideRect,
  guides: readonly Guide[],
  threshold: number
): { x: number; y: number } {
  const positions = (axis: GuideAxis) =>
    guides
      .filter((guide) => guide.axis === axis)
      .map((guide) => guide.position);
  return {
    x: nearestOffset(
      [rect.left, rect.left + rect.width / 2, rect.left + rect.width],
      positions('x'),
      threshold
    ),
    y: nearestOffset(
      [rect.top, rect.top + rect.height / 2, rect.top + rect.height],
      positions('y'),
      threshold
    ),
  };
}

/** Page offsets (margins) from each frame edge, in frame units. */
export interface PageOffsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const NO_OFFSETS: PageOffsets = { top: 0, right: 0, bottom: 0, left: 0 };

export const OFFSET_GUIDE_PREFIX = 'offset-';

/** Permanent guides marking the non-zero page offsets. */
export function offsetGuides(
  offsets: PageOffsets,
  frameWidth: number,
  frameHeight: number
): Guide[] {
  const guides: Guide[] = [
    { id: `${OFFSET_GUIDE_PREFIX}left`, axis: 'x', position: offsets.left },
    {
      id: `${OFFSET_GUIDE_PREFIX}right`,
      axis: 'x',
      position: frameWidth - offsets.right,
    },
    { id: `${OFFSET_GUIDE_PREFIX}top`, axis: 'y', position: offsets.top },
    {
      id: `${OFFSET_GUIDE_PREFIX}bottom`,
      axis: 'y',
      position: frameHeight - offsets.bottom,
    },
  ];
  const values = [offsets.left, offsets.right, offsets.top, offsets.bottom];
  return guides.filter((_, index) => values[index] > 0);
}
