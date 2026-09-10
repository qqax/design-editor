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
//         <Category title="Filled" styleType="filled" shapes={filteredShapes} onAddShape={onAddShape} />
//         <Category title="Outline" styleType="outline" shapes={filteredShapes} onAddShape={onAddShape} />
//         <Category title="Gradient" styleType="gradient" shapes={filteredShapes} onAddShape={onAddShape} />
//         <Category title="Image" styleType="image" shapes={filteredShapes} onAddShape={onAddShape} />

//         {filteredShapes.length === 0 && (
//            <div className="mt-8 text-center text-[var(--de-color-text-muted)] text-sm">
//              No shapes found for "{search}"
//            </div>
//         )}
//       </div>
//     </div>
//   )
// }

// function Category({
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
//             <RowTile shape={shape} styleType={styleType} onClick={() => onAddShape(shape.d, shape.viewBox, styleType)} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// function RowTile({ shape, styleType, onClick }: { shape: ShapeDef; styleType: ShapeStyleType; onClick: () => void }) {
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

import { Search } from 'lucide-react';

import { Category } from '../../common';
import { CATEGORY_ORDER, SHAPES } from '../model';

interface Props {
  onAddShape: (src: string) => void;
}

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
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center rounded-lg border border-[var(--de-color-border)] bg-[color-mix(in_srgb,var(--de-color-text)_5%,transparent)] px-3 py-2 transition-colors focus-within:border-[var(--de-color-primary)]">
          <Search
            className="mr-2 text-[var(--de-color-text-muted)]"
            size={14}
          />
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
          const categoryShapes = filteredShapes
            .filter((shape) => shape.category === category.key)
            .map((shape) => ({
              ...shape,
              src: `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`,
            }));

          return (
            <Category
              key={category.key}
              items={categoryShapes}
              onAddItem={onAddShape}
              title={category.label}
            />
          );
        })}

        {filteredShapes.length === 0 && (
          <div className="mt-8 text-center text-sm text-[var(--de-color-text-muted)]">
            No shapes found for &#34;{search}&#34;
          </div>
        )}
      </div>
    </div>
  );
}
