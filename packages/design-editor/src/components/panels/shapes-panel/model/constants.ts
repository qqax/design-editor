import type { ShapeCategoryType, ShapeDef } from './types';

const SHAPE_FILES: Record<ShapeCategoryType, string[]> = {
  filled: [
    // Geometric shapes
    'filled-line.png',
    'filled-square.png',
    'filled-rectangle.png',
    'filled-rounded-rectangle.png',
    'filled-ellipse.png',
    'filled-oval.png',
    'filled-pill.png',
    'filled-ring.png',
    // Circular / arc shapes
    'filled-pie.png',
    'filled-semicircle.png',
    'filled-quarter-circle.png',
    'filled-quarter-circle-outline.png',
    'filled-crescent.png',
    // Polygon shapes
    'filled-triangle.png',
    'filled-triangle-right.png',
    'filled-polygon.png',
    'filled-rhombus.png',
    'filled-kite.png',
    // Decorative shapes
    'filled-star.png',
    'filled-star-round.png',
    'filled-four-star.png',
    'filled-sun.png',
    'filled-cross.png',
    'filled-heart.png',
    'filled-trefoil.png',
    'filled-quarterfoil.png',
    // Organic / abstract shapes
    'filled-blob.png',
    'filled-cloud.png',
    'filled-wiggle.png',
    'filled-ziczac.png',
    // Frames & masks
    'filled-frame.png',
    'filled-round-mask.png',
    'filled-rectangle-mask.png',
    // Arrows
    'filled-arrow-thin.png',
    'filled-arrow-thin-rounded.png',
    'filled-arrow-wide.png',
    'filled-arrow-fat.png',
    'filled-arrow-archer.png',
  ],

  outline: [
    'outline-arrow-archer.png',
    'outline-arrow-fat.png',
    'outline-arrow-thin-rounded.png',
    'outline-arrow-thin.png',
    'outline-arrow-wide.png',
    'outline-blob.png',
    'outline-cloud.png',
    'outline-crescent.png',
    'outline-cross.png',
    'outline-ellipse.png',
    'outline-four-star.png',
    'outline-frame.png',
    'outline-heart.png',
    'outline-kite.png',
    'outline-line.png',
    'outline-oval.png',
    'outline-pie.png',
    'outline-pill.png',
    'outline-quarter-circle-outline.png',
    'outline-quarter-circle.png',
    'outline-quarterfoil.png',
    'outline-rectangle-mask.png',
    'outline-rectangle.png',
    'outline-rhombus.png',
    'outline-ring.png',
    'outline-round-mask.png',
    'outline-rounded-rectangle.png',
    'outline-semicircle.png',
    'outline-square.png',
    'outline-star-round.png',
    'outline-star.png',
    'outline-sun.png',
    'outline-trefoil.png',
    'outline-triangle-right.png',
    'outline-triangle.png',
    'outline-wiggle.png',
    'outline-ziczac.png',
  ],

  gradient: [
    'gradient-arrow-archer.png',
    'gradient-arrow-fat.png',
    'gradient-arrow-thin-rounded.png',
    'gradient-arrow-thin.png',
    'gradient-arrow-wide.png',
    'gradient-blob.png',
    'gradient-cloud.png',
    'gradient-crescent.png',
    'gradient-cross.png',
    'gradient-ellipse.png',
    'gradient-four-star.png',
    'gradient-frame.png',
    'gradient-heart.png',
    'gradient-kite.png',
    'gradient-line.png',
    'gradient-oval.png',
    'gradient-pie.png',
    'gradient-pill.png',
    'gradient-polygon.png',
    'gradient-quarter-circle-outline.png',
    'gradient-quarter-circle.png',
    'gradient-quarterfoil.png',
    'gradient-rectangle-mask.png',
    'gradient-rhombus.png',
    'gradient-ring.png',
    'gradient-round-mask.png',
    'gradient-rounded-rectangle.png',
    'gradient-semicircle.png',
    'gradient-square.png',
    'gradient-star-round.png',
    'gradient-star.png',
    'gradient-sun.png',
    'gradient-trefoil.png',
    'gradient-triangle-right.png',
    'gradient-triangle.png',
    'gradient-wiggle.png',
    'gradient-ziczac.png',
  ],

  image: [
    // Geometric shapes
    'image-line.png',
    'image-square.png',
    'image-rectangle.png',
    'image-rounded-rectangle.png',
    'image-ellipse.png',
    'image-oval.png',
    'image-pill.png',
    'image-ring.png',

    // Circular / arc shapes
    'image-pie.png',
    'image-semicircle.png',
    'image-quarter-circle.png',
    'image-quarter-circle-outline.png',
    'image-crescent.png',

    // Polygon shapes
    'image-triangle.png',
    'image-triangle-right.png',
    'image-polygon.png',
    'image-rhombus.png',
    'image-kite.png',

    // Decorative shapes
    'image-star.png',
    'image-star-round.png',
    'image-four-star.png',
    'image-sun.png',
    'image-cross.png',
    'image-heart.png',
    'image-trefoil.png',
    'image-quarterfoil.png',

    // Organic / abstract shapes
    'image-blob.png',
    'image-cloud.png',
    'image-wiggle.png',
    'image-ziczac.png',

    // Frames & masks
    'image-frame.png',
    'image-round-mask.png',
    'image-rectangle-mask.png',

    // Arrows
    'image-arrow-thin.png',
    'image-arrow-thin-rounded.png',
    'image-arrow-wide.png',
    'image-arrow-fat.png',
    'image-arrow-archer.png',
  ],

  abstract: [
    'filled-organic-1.png',
    'filled-organic-2.png',
    'filled-organic-3.png',
    'filled-organic-4.png',
    'filled-organic-dot-1.png',
    'filled-organic-dot-2.png',
    'filled-splash-1.png',
    'filled-splash-2.png',
    'filled-splash-3.png',
    'filled-splash-4.png',
  ],

  abstract_outline: [
    'outline-organic-1.png',
    'outline-organic-2.png',
    'outline-organic-3.png',
    'outline-organic-4.png',
    'outline-organic-dot-1.png',
    'outline-organic-dot-2.png',
    'outline-splash-1.png',
    'outline-splash-2.png',
    'outline-splash-3.png',
    'outline-splash-4.png',
  ],

  abstract_gradient: [
    'gradient-organic-1.png',
    'gradient-organic-2.png',
    'gradient-organic-3.png',
    'gradient-organic-4.png',
    'gradient-organic-dot-1.png',
    'gradient-organic-dot-2.png',
    'gradient-splash-1.png',
    'gradient-splash-2.png',
    'gradient-splash-3.png',
    'gradient-splash-4.png',
  ],

  abstract_image: [
    'image-organic-1.png',
    'image-organic-2.png',
    'image-organic-3.png',
    'image-organic-4.png',
    'image-organic-dot-1.png',
    'image-organic-dot-2.png',
    'image-splash-1.png',
    'image-splash-2.png',
    'image-splash-3.png',
    'image-splash-4.png',
  ],
};

// ─────────────────────────────────────────────────────────────
// CATEGORY ORDER  (mirrors StickersPanel pattern)
// ─────────────────────────────────────────────────────────────

export const CATEGORY_ORDER: { key: ShapeCategoryType; label: string }[] = [
  { key: 'filled', label: 'Filled' },
  { key: 'outline', label: 'Outline' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'image', label: 'Image' },
  { key: 'abstract', label: 'Abstract' },
  { key: 'abstract_outline', label: 'Abstract Outline' },
  { key: 'abstract_gradient', label: 'Abstract Gradient' },
  { key: 'abstract_image', label: 'Abstract Image' },
];

export const SHAPES: ShapeDef[] = Object.entries(SHAPE_FILES).flatMap(
  ([category, files]) =>
    files.map((file) => ({
      id: file.replace(/\.(svg|png)$/i, '').replace(/_/g, '-'),

      label: file
        .replace(/\.(svg|png)$/i, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),

      category: category as ShapeCategoryType,

      file,
    }))
);
