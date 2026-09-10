'use client';
// import React, { useState } from 'react'
// import { Tooltip } from 'antd'
// import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'

// export type ShapeStyleType = 'filled' | 'outline' | 'gradient' | 'image'

// interface ShapeDef {
//   id: string
//   label: string
//   d: string
//   viewBox: string
// }

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

// interface Props {
//   onAddShape: (d: string, viewBox: string, styleType: ShapeStyleType) => void
// }

// export function ShapesPanel({ onAddShape }: Props) {
//   const [search, setSearch] = useState('')

//   const filteredShapes = search.trim()
//     ? SHAPES.filter(s => s.label.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
//     : SHAPES

//   return (
//     <div className="flex flex-col h-full bg-surface">
//       <div className="px-4 pt-4 pb-2">
//         <div className="flex items-center bg-[color-mix(in_srgb,var(--de-color-text)_5%,transparent)] rounded-lg px-3 py-2 border border-[var(--de-color-border)] focus-within:border-[var(--de-color-primary)] transition-colors">
//           <SearchOutlined className="text-[var(--de-color-text-muted)] mr-2" />
//           <input
//             type="text"
//             placeholder="Search shapes..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="bg-transparent border-none outline-none flex-1 text-[var(--de-color-text)] text-sm"
//           />
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide px-4">
//         <ShapeCategory title="Filled" styleType="filled" shapes={filteredShapes} onAddShape={onAddShape} />
//         <ShapeCategory title="Outline" styleType="outline" shapes={filteredShapes} onAddShape={onAddShape} />
//         <ShapeCategory title="Gradient" styleType="gradient" shapes={filteredShapes} onAddShape={onAddShape} />
//         <ShapeCategory title="Image" styleType="image" shapes={filteredShapes} onAddShape={onAddShape} />

//         {filteredShapes.length === 0 && (
//            <div className="mt-8 text-center text-[var(--de-color-text-muted)] text-sm">
//              No shapes found for "{search}"
//            </div>
//         )}
//       </div>
//     </div>
//   )
// }

// function ShapeCategory({
//   title, styleType, shapes, onAddShape
// }: {
//   title: string, styleType: ShapeStyleType, shapes: ShapeDef[],
//   onAddShape: (d: string, viewBox: string, styleType: ShapeStyleType) => void
// }) {
//   const [expanded, setExpanded] = useState(false)
//   if (shapes.length === 0) return null

//   return (
//     <div className="mt-5">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-bold text-[var(--de-color-text)] tracking-tight">{title}</h3>
//         {shapes.length > 3 && (
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="flex items-center text-xs font-semibold text-[var(--de-color-text-muted)] hover:text-[var(--de-color-primary)] transition-colors bg-transparent border-none cursor-pointer"
//           >
//             {expanded ? 'Less' : `More (${shapes.length})`}
//             {expanded ? <UpOutlined className="ml-1 text-[10px]" /> : <DownOutlined className="ml-1 text-[10px]" />}
//           </button>
//         )}
//       </div>

//       <div className={`gap-2 ${expanded ? 'grid grid-cols-3' : 'flex overflow-x-auto scrollbar-hide snap-x'}`}>
//         {shapes.map((shape) => (
//           <div key={shape.id} className={expanded ? 'w-full' : 'snap-start shrink-0'}>
//             <ShapeTile shape={shape} styleType={styleType} onClick={() => onAddShape(shape.d, shape.viewBox, styleType)} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// function ShapeTile({ shape, styleType, onClick }: { shape: ShapeDef; styleType: ShapeStyleType; onClick: () => void }) {
//   const [hov, setHov] = useState(false)

//   // Use the downloaded PNGs from public folder
//   const imgUrl = `/shapes/thumbnails/${styleType}-${shape.id}.png`

//   const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
//     e.dataTransfer.effectAllowed = 'copy'
//     e.dataTransfer.setData('text/x-qqax-type', 'shape')
//     e.dataTransfer.setData('text/x-qqax-shape-d', shape.d)
//     e.dataTransfer.setData('text/x-qqax-shape-viewbox', shape.viewBox)
//     e.dataTransfer.setData('text/x-qqax-shape-style', styleType)
//   }

//   return (
//     <Tooltip title={shape.label} placement="top">
//       <button
//         onClick={onClick}
//         draggable
//         onDragStart={handleDragStart}
//         onMouseEnter={() => setHov(true)}
//         onMouseLeave={() => setHov(false)}
//         className="w-[72px] h-[72px] rounded-xl flex items-center justify-center cursor-pointer border-none outline-none transition-all duration-200 relative overflow-hidden"
//         style={{
//           background: 'color-mix(in srgb, var(--de-color-text) 5%, transparent)',
//           boxShadow: hov ? '0 0 0 2px var(--de-color-primary)' : 'none',
//         }}
//       >
//         <img
//           src={imgUrl}
//           alt={shape.label}
//           draggable={false}
//           className="w-[85%] h-[85%] object-contain transition-opacity duration-200 pointer-events-none"
//           style={{ opacity: hov ? 0.8 : 1 }}
//           onError={(e) => {
//              // Fallback if image failed to download or doesn't exist
//              e.currentTarget.style.display = 'none';
//           }}
//         />
//       </button>
//     </Tooltip>
//   )
// }

import React, { useState } from 'react';

import { ChevronDown, ChevronRight, ChevronUp, Search } from 'lucide-react';

import { Tooltip } from '../primitives';

export type ShapeCategoryType =
  | 'filled'
  | 'outline'
  | 'gradient'
  | 'image'
  | 'abstract'
  | 'abstract_outline'
  | 'abstract_gradient'
  | 'abstract_image';

export interface ShapeDef {
  id: string;
  label: string;
  category: ShapeCategoryType;
  file: string;
}
interface Props {
  onAddShape: (src: string) => void;
}

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
// ─────────────────────────────────────────────────────────────
// CATEGORY ORDER  (mirrors StickersPanel pattern)
// ─────────────────────────────────────────────────────────────

const CATEGORY_ORDER: { key: ShapeCategoryType; label: string }[] = [
  { key: 'filled', label: 'Filled' },
  { key: 'outline', label: 'Outline' },
  { key: 'gradient', label: 'Gradient' },
  { key: 'image', label: 'Image' },
  { key: 'abstract', label: 'Abstract' },
  { key: 'abstract_outline', label: 'Abstract Outline' },
  { key: 'abstract_gradient', label: 'Abstract Gradient' },
  { key: 'abstract_image', label: 'Abstract Image' },
];

// ─────────────────────────────────────────────────────────────
// MAIN PANEL
// ─────────────────────────────────────────────────────────────

export function ShapesPanel({ onAddShape }: Props) {
  const [search, setSearch] = useState('');

  const filteredShapes = search.trim()
    ? SHAPES.filter(
        (s) =>
          s.label.toLowerCase().includes(search.toLowerCase()) ||
          s.id.toLowerCase().includes(search.toLowerCase())
      )
    : SHAPES;

  return (
    <div className="bg-surface flex h-full flex-col">
      {/* SEARCH */}
      <div className="px-4 pb-2 pt-4">
        <div className="flex items-center rounded-lg border border-[var(--de-color-border)] bg-[color-mix(in_srgb,var(--de-color-text)_5%,transparent)] px-3 py-2 transition-colors focus-within:border-[var(--de-color-primary)]">
          <Search className="mr-2 text-[var(--de-color-text-muted)]" size={14} />
          <input
            className="flex-1 border-none bg-transparent text-sm text-[var(--de-color-text)] outline-none"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shapes..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4 pb-6">
        {CATEGORY_ORDER.map((category) => {
          const categoryShapes = filteredShapes.filter(
            (shape) => shape.category === category.key
          );

          return (
            <ShapeCategory
              key={category.key}
              onAddShape={onAddShape}
              shapes={categoryShapes}
              title={category.label}
            />
          );
        })}

        {filteredShapes.length === 0 && (
          <div className="mt-8 text-center text-sm text-[var(--de-color-text-muted)]">
            No shapes found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CATEGORY  (mirrors StickerCategory exactly)
// ─────────────────────────────────────────────────────────────

function ShapeCategory({
  title,
  shapes,
  onAddShape,
}: {
  title: string;
  shapes: ShapeDef[];
  onAddShape: (src: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (shapes.length === 0) return null;

  const hasMore = shapes.length > 0;

  return (
    <div className="mt-5">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-tight text-[var(--de-color-text)]">
          {title}
        </h3>

        {hasMore ? (
          <button
            className="flex cursor-pointer items-center border-none bg-transparent text-xs font-semibold text-[var(--de-color-text-muted)] transition-colors hover:text-[var(--de-color-primary)]"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Less' : `More (${shapes.length})`}

            {expanded ? (
              <ChevronUp className="ml-1" size={10} />
            ) : (
              <ChevronDown className="ml-1" size={10} />
            )}
          </button>
        ) : null}
      </div>

      {expanded ? (
        /* EXPANDED — 3-col grid */
        <div className="mt-1 grid auto-rows-fr grid-cols-3 gap-2">
          {shapes.map((shape) => (
            <ShapeTile
              key={shape.id}
              shape={shape}
              onClick={() =>
                onAddShape(
                  `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`
                )
              }
            />
          ))}
        </div>
      ) : (
        /* COLLAPSED — horizontal scroll, scrollbar hidden, with arrow hint */
        <ScrollRow onAddShape={onAddShape} shapes={shapes} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCROLL ROW  (mirrors ScrollRow from StickersPanel 1:1)
// ─────────────────────────────────────────────────────────────

function ScrollRow({
  shapes,
  onAddShape,
}: {
  shapes: ShapeDef[];
  onAddShape: (src: string) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // Hide arrow when scrolled to the end (within 4px)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <style>{`.sticker-hscroll::-webkit-scrollbar { display: none; }`}</style>

      {/* Scroll container
          - mx-[-16px] breaks out of the parent px-4 so left edge is never clipped
          - px-[16px] restores the visual indent
          - py-[3px] gives the 2px ring room top & bottom             */}
      <div
        ref={scrollRef}
        className="sticker-hscroll mx-[-16px] flex gap-2 px-[16px] py-[3px]"
        onScroll={checkScroll}
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="shrink-0"
            style={{
              width: 'calc((100% - 24px) / 4)',
            }}
          >
            <ShapeTile
              shape={shape}
              onClick={() =>
                onAddShape(
                  `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`
                )
              }
            />
          </div>
        ))}
      </div>

      {/* Right arrow — fades out when fully scrolled */}
      {canScrollRight ? (
        <button
          className="absolute right-0 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none outline-none"
          onClick={scrollRight}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'var(--de-color-surface, #fff)',
            boxShadow: '-8px 0 14px 8px var(--de-color-surface, #fff)',
          }}
        >
          <ChevronRight
            size={14}
            style={{ color: 'var(--de-color-text-muted)' }}
          />
        </button>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TILE  (fluid width, aspect-ratio 1/1 — mirrors StickerTile)
// ─────────────────────────────────────────────────────────────

function ShapeTile({
  shape,
  onClick,
  expanded = false,
}: {
  shape: ShapeDef;
  onClick: () => void;
  expanded?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const imageUrl = `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`;

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/x-qqax-type', 'shape');
    e.dataTransfer.setData('text/x-qqax-shape-src', imageUrl);
  };

  return (
    <Tooltip placement="top" title={shape.label}>
      <button
        draggable
        className="flex w-full shrink-0 cursor-pointer items-center justify-center rounded-xl border-none outline-none transition-all duration-200"
        onClick={onClick}
        onDragStart={handleDragStart}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          aspectRatio: '1 / 1',

          background: 'color-mix(in srgb, var(--de-color-text) 5%, transparent)',

          boxShadow: hovered
            ? '0 0 0 2px var(--de-color-border, #d1d5db)'
            : 'none',

          transform: hovered ? 'scale(1.03)' : 'scale(1)',
        }}
      >
        <img
          alt={shape.label}
          className="pointer-events-none h-[78%] w-[78%] select-none object-contain transition-opacity duration-200"
          draggable={false}
          src={imageUrl}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          style={{
            opacity: hovered ? 0.85 : 1,
          }}
        />
      </button>
    </Tooltip>
  );
}
