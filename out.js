'use client';

import React, { useState } from 'react';

import {
  DownOutlined,
  RightOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { jsx, jsxs } from 'react/jsx-runtime';

import { Tooltip } from '../primitives';

const SHAPE_FILES = {
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
export const SHAPES = Object.entries(SHAPE_FILES).flatMap(([category, files]) =>
  files.map((file) => ({
    id: file.replace(/\.(svg|png)$/i, '').replace(/_/g, '-'),
    label: file
      .replace(/\.(svg|png)$/i, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    category,
    file,
  }))
);
const CATEGORY_ORDER = [
  { key: 'filled', label: 'Filled' },
  { key: 'outline', label: 'Outline' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'image', label: 'Image' },
  { key: 'abstract', label: 'Abstract' },
  { key: 'abstract_outline', label: 'Abstract Outline' },
  { key: 'abstract_gradient', label: 'Abstract Gradient' },
  { key: 'abstract_image', label: 'Abstract Image' },
];
export function ShapesPanel({ onAddShape }) {
  const [search, setSearch] = useState('');
  const filteredShapes = search.trim()
    ? SHAPES.filter(
        (s) =>
          s.label.toLowerCase().includes(search.toLowerCase()) ||
          s.id.toLowerCase().includes(search.toLowerCase())
      )
    : SHAPES;
  return /* @__PURE__ */ jsxs('div', {
    className: 'flex flex-col h-full bg-surface',
    children: [
      /* @__PURE__ */ jsx('div', {
        className: 'px-4 pt-4 pb-2',
        children: /* @__PURE__ */ jsxs('div', {
          className:
            'flex items-center bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] rounded-lg px-3 py-2 border border-[var(--color-border)] focus-within:border-[var(--color-primary)] transition-colors',
          children: [
            /* @__PURE__ */ jsx(SearchOutlined, {
              className: 'text-[var(--color-text-muted)] mr-2',
            }),
            /* @__PURE__ */ jsx('input', {
              type: 'text',
              placeholder: 'Search shapes...',
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className:
                'bg-transparent border-none outline-none flex-1 text-[var(--color-text)] text-sm',
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxs('div', {
        className: 'flex-1 overflow-y-auto pb-6 scrollbar-hide px-4',
        children: [
          CATEGORY_ORDER.map((category) => {
            const categoryShapes = filteredShapes.filter(
              (shape) => shape.category === category.key
            );
            return /* @__PURE__ */ jsx(
              ShapeCategory,
              {
                title: category.label,
                shapes: categoryShapes,
                onAddShape,
              },
              category.key
            );
          }),
          filteredShapes.length === 0 &&
            /* @__PURE__ */ jsxs('div', {
              className:
                'mt-8 text-center text-[var(--color-text-muted)] text-sm',
              children: ['No shapes found for "', search, '"'],
            }),
        ],
      }),
    ],
  });
}
const ShapeCategory = ({ title, shapes, onAddShape }) => {
  const [expanded, setExpanded] = useState(false);
  if (shapes.length === 0) return null;
  const hasMore = shapes.length > 0;
  return /* @__PURE__ */ jsxs('div', {
    className: 'mt-5',
    children: [
      /* @__PURE__ */ jsxs('div', {
        className: 'flex items-center justify-between mb-3',
        children: [
          /* @__PURE__ */ jsx('h3', {
            className:
              'text-sm font-bold text-[var(--color-text)] tracking-tight',
            children: title,
          }),
          hasMore &&
            /* @__PURE__ */ jsxs('button', {
              onClick: () => setExpanded(!expanded),
              className:
                'flex items-center text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors bg-transparent border-none cursor-pointer',
              children: [
                expanded ? 'Less' : `More (${shapes.length})`,
                expanded
                  ? /* @__PURE__ */ jsx(UpOutlined, {
                      className: 'ml-1 text-[10px]',
                    })
                  : /* @__PURE__ */ jsx(DownOutlined, {
                      className: 'ml-1 text-[10px]',
                    }),
              ],
            }),
        ],
      }),
      expanded
        ? /* EXPANDED — 3-col grid */
          /* @__PURE__ */ jsx('div', {
            className: 'grid grid-cols-3 gap-2 mt-1 auto-rows-fr',
            children: shapes.map((shape) =>
              /* @__PURE__ */ jsx(
                ShapeTile,
                {
                  shape,
                  onClick: () =>
                    onAddShape(
                      `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`
                    ),
                },
                shape.id
              )
            ),
          })
        : /* COLLAPSED — horizontal scroll, scrollbar hidden, with arrow hint */
          /* @__PURE__ */ jsx(ScrollRow, { shapes, onAddShape }),
    ],
  });
};
function ScrollRow({ shapes, onAddShape }) {
  const scrollRef = React.useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' });
  };
  return /* @__PURE__ */ jsxs('div', {
    className: 'relative',
    children: [
      /* @__PURE__ */ jsx('style', {
        children: `.sticker-hscroll::-webkit-scrollbar { display: none; }`,
      }),
      /* @__PURE__ */ jsx('div', {
        ref: scrollRef,
        className: 'sticker-hscroll flex gap-2 py-[3px] mx-[-16px] px-[16px]',
        style: {
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        },
        onScroll: checkScroll,
        children: shapes.map((shape) =>
          /* @__PURE__ */ jsx(
            'div',
            {
              className: 'shrink-0',
              style: {
                width: 'calc((100% - 24px) / 4)',
              },
              children: /* @__PURE__ */ jsx(ShapeTile, {
                shape,
                onClick: () =>
                  onAddShape(
                    `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`
                  ),
              }),
            },
            shape.id
          )
        ),
      }),
      canScrollRight &&
        /* @__PURE__ */ jsx('button', {
          onClick: scrollRight,
          className:
            'absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer border-none outline-none',
          style: {
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'var(--color-surface, #fff)',
            boxShadow: '-8px 0 14px 8px var(--color-surface, #fff)',
          },
          children: /* @__PURE__ */ jsx(RightOutlined, {
            style: { fontSize: 10, color: 'var(--color-text-muted)' },
          }),
        }),
    ],
  });
}
function ShapeTile({ shape, onClick, expanded = false }) {
  const [hovered, setHovered] = useState(false);
  const imageUrl = `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`;
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/x-qqax-type', 'shape');
    e.dataTransfer.setData('text/x-qqax-shape-src', imageUrl);
  };
  return /* @__PURE__ */ jsx(Tooltip, {
    title: shape.label,
    placement: 'top',
    children: /* @__PURE__ */ jsx('button', {
      onClick,
      draggable: true,
      onDragStart: handleDragStart,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      className:
        '\n          w-full\n          rounded-xl\n          flex\n          items-center\n          justify-center\n          cursor-pointer\n          border-none\n          outline-none\n          transition-all\n          duration-200\n          shrink-0\n        ',
      style: {
        width: '100%',
        aspectRatio: '1 / 1',
        background: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
        boxShadow: hovered ? '0 0 0 2px var(--color-border, #d1d5db)' : 'none',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
      },
      children: /* @__PURE__ */ jsx('img', {
        src: imageUrl,
        alt: shape.label,
        draggable: false,
        className:
          '\n            w-[78%]\n            h-[78%]\n            object-contain\n            pointer-events-none\n            select-none\n            transition-opacity\n            duration-200\n          ',
        style: {
          opacity: hovered ? 0.85 : 1,
        },
        onError: (e) => {
          e.currentTarget.style.display = 'none';
        },
      }),
    }),
  });
}
