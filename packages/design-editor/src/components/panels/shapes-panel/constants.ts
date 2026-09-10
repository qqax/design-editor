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
// SHAPES ORDER  (mirrors StickersPanel pattern)
// ─────────────────────────────────────────────────────────────

export const SHAPES_ORDER: { key: ShapeCategoryType; label: string }[] = [
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

// // The 21 core shapes that map to the downloaded PNGs
// export const SHAPES: ShapeDef[] = [
//   { id: 'square', label: 'Square', viewBox: '0 0 200 200', d: 'M 10 10 L 190 10 L 190 190 L 10 190 Z' },
//   { id: 'ellipse', label: 'Ellipse', viewBox: '0 0 200 200', d: 'M 100 10 C 149.7 10 190 50.3 190 100 C 190 149.7 149.7 190 100 190 C 50.3 190 10 149.7 10 100 C 10 50.3 50.3 10 100 10 Z' },
//   { id: 'polygon', label: 'Polygon', viewBox: '0 0 200 200', d: 'M 100 15 L 185.6 72.2 L 152.9 172.8 L 47.1 172.8 L 14.4 72.2 Z' },
//   { id: 'line', label: 'Line', viewBox: '0 0 200 200', d: 'M 20 10 L 40 10 L 180 170 L 160 190 Z' },
//   { id: 'star-round', label: 'Rounded Star', viewBox: '0 0 200 200', d: 'M 100 10 L 121 70 L 185 72 L 134 111 L 152 172 L 100 136 L 47 172 L 65 111 L 14 72 L 78 70 Z' },
//   { id: 'star', label: 'Star', viewBox: '0 0 200 200', d: 'M 100 10 L 121 70 L 185 72 L 134 111 L 152 172 L 100 136 L 47 172 L 65 111 L 14 72 L 78 70 Z' },
//   { id: 'arrow-archer', label: 'Archer Arrow', viewBox: '0 0 200 200', d: 'M 0 70 L 120 70 L 120 25 L 200 100 L 120 175 L 120 130 L 0 130 Z' },
//   { id: 'arrow-thin-rounded', label: 'Thin Rounded Arrow', viewBox: '0 0 200 200', d: 'M 0 85 L 140 85 L 140 50 L 200 100 L 140 150 L 140 115 L 0 115 Z' },
//   { id: 'arrow-thin', label: 'Thin Arrow', viewBox: '0 0 200 200', d: 'M 0 85 L 140 85 L 140 50 L 200 100 L 140 150 L 140 115 L 0 115 Z' },
//   { id: 'arrow-wide', label: 'Wide Arrow', viewBox: '0 0 200 200', d: 'M 0 60 L 100 60 L 100 10 L 200 100 L 100 190 L 100 140 L 0 140 Z' },
//   { id: 'arrow-fat', label: 'Fat Arrow', viewBox: '0 0 200 200', d: 'M 0 50 L 80 50 L 80 0 L 200 100 L 80 200 L 80 150 L 0 150 Z' },
//   { id: 'splash-4', label: 'Splash 4', viewBox: '0 0 200 200', d: 'M 100 10 C 130 10 160 40 190 70 C 200 100 180 150 140 180 C 100 200 60 190 30 160 C 0 130 10 80 40 50 C 60 20 80 0 100 10 Z' },
//   { id: 'splash-3', label: 'Splash 3', viewBox: '0 0 200 200', d: 'M 100 10 C 130 10 160 40 190 70 C 200 100 180 150 140 180 C 100 200 60 190 30 160 C 0 130 10 80 40 50 C 60 20 80 0 100 10 Z' },
//   { id: 'splash-2', label: 'Splash 2', viewBox: '0 0 200 200', d: 'M 100 10 C 130 10 160 40 190 70 C 200 100 180 150 140 180 C 100 200 60 190 30 160 C 0 130 10 80 40 50 C 60 20 80 0 100 10 Z' },
//   { id: 'splash-1', label: 'Splash 1', viewBox: '0 0 200 200', d: 'M 100 10 C 130 10 160 40 190 70 C 200 100 180 150 140 180 C 100 200 60 190 30 160 C 0 130 10 80 40 50 C 60 20 80 0 100 10 Z' },
//   { id: 'organic-dot-2', label: 'Organic Dot 2', viewBox: '0 0 200 200', d: 'M 100 10 C 150 20 180 60 190 110 C 190 160 140 190 90 180 C 40 170 10 120 20 70 C 30 20 60 0 100 10 Z' },
//   { id: 'organic-dot-1', label: 'Organic Dot 1', viewBox: '0 0 200 200', d: 'M 100 10 C 150 20 180 60 190 110 C 190 160 140 190 90 180 C 40 170 10 120 20 70 C 30 20 60 0 100 10 Z' },
//   { id: 'organic-4', label: 'Organic 4', viewBox: '0 0 200 200', d: 'M 100 10 C 150 20 180 60 190 110 C 190 160 140 190 90 180 C 40 170 10 120 20 70 C 30 20 60 0 100 10 Z' },
//   { id: 'organic-3', label: 'Organic 3', viewBox: '0 0 200 200', d: 'M 100 10 C 150 20 180 60 190 110 C 190 160 140 190 90 180 C 40 170 10 120 20 70 C 30 20 60 0 100 10 Z' },
//   { id: 'organic-2', label: 'Organic 2', viewBox: '0 0 200 200', d: 'M 100 10 C 150 20 180 60 190 110 C 190 160 140 190 90 180 C 40 170 10 120 20 70 C 30 20 60 0 100 10 Z' },
//   { id: 'organic-1', label: 'Organic 1', viewBox: '0 0 200 200', d: 'M 100 10 C 150 20 180 60 190 110 C 190 160 140 190 90 180 C 40 170 10 120 20 70 C 30 20 60 0 100 10 Z' },
// ]
