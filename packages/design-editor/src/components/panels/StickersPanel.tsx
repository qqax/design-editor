'use client';

import React, { useMemo, useState } from 'react';

import { ChevronDown, ChevronRight, ChevronUp, Search } from 'lucide-react';

import { Tooltip } from '../primitives';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type StickerCategoryType =
  | '3Dstickers'
  | 'craft'
  | 'doodle'
  | 'emoji'
  | 'emoticons'
  | 'florals'
  | 'hand';

export interface StickerDef {
  id: string;
  label: string;
  category: StickerCategoryType;
  file: string;
}

interface Props {
  onAddSticker: (src: string) => void;
}

// ─────────────────────────────────────────────────────────────
// STICKER FILES
// ONLY ADD FILE NAMES HERE
// Supports SVG + PNG
// ─────────────────────────────────────────────────────────────

const STICKER_FILES: Record<StickerCategoryType, string[]> = {
  emoji: [
    'emoji_anguished.svg',
    'emoji_ape.svg',
    'emoji_beer.svg',
    'emoji_crying.svg',
    'emoji_devil.svg',
    'emoji_doubtful.svg',
    'emoji_drooling.svg',
    'emoji_flushed.svg',
    'emoji_grim.svg',
    'emoji_grimacing.svg',
    'emoji_halo.svg',
    'emoji_happyface.svg',
    'emoji_hearteyes.svg',
    'emoji_lips.svg',
    'emoji_melon.svg',
    'emoji_nauseated.svg',
    'emoji_pacman.svg',
    'emoji_persevering.svg',
    'emoji_pizza.svg',
    'emoji_rollingeyes.svg',
    'emoji_sad.svg',
    'emoji_skull.svg',
    'emoji_smile.svg',
    'emoji_sunglasses.svg',
    'emoji_tearsofjoy.svg',
    'emoji_thumbsup.svg',
    'emoji_tongueout.svg',
  ],

  doodle: [
    'doodle_camera.svg',
    'doodle_divingmask.svg',
    'doodle_fish.svg',
    'doodle_hat.svg',
    'doodle_hula.svg',
    'doodle_jetpack.svg',
    'doodle_pipe.svg',
    'doodle_rocket.svg',
    'doodle_saturn.svg',
    'doodle_skateboard.svg',
    'doodle_spaceman.svg',
    'doodle_star.svg',
    'doodle_starfish.svg',
    'doodle_sun.svg',
    'doodle_surfing.svg',
    'doodle_wing_01.svg',
    'doodle_wing_02.svg',
  ],

  craft: [
    'clip.png',
    'photo_frame.svg',
    'polaroid_frame.png',
    'tape01.png',
    'tape02.png',
    'tape03.png',
    'tape04.png',
    'tape05.png',
    'tape06.png',
    'tape07.png',
    'tape08.png',
    'tape09.png',
    'tape10.png',
    'tape11.png',
    'tape12.png',
  ],

  emoticons: [
    'imgly_sticker_emoticons_angel.svg',
    'imgly_sticker_emoticons_angry.svg',
    'imgly_sticker_emoticons_anxious.svg',
    'imgly_sticker_emoticons_asleep.svg',
    'imgly_sticker_emoticons_attention.svg',
    'imgly_sticker_emoticons_baby_chicken.svg',
    'imgly_sticker_emoticons_batman.svg',
    'imgly_sticker_emoticons_beer.svg',
    'imgly_sticker_emoticons_blush.svg',
    'imgly_sticker_emoticons_boxer.svg',
    'imgly_sticker_emoticons_business.svg',
    'imgly_sticker_emoticons_chicken.svg',
    'imgly_sticker_emoticons_cool.svg',
    'imgly_sticker_emoticons_cry.svg',
    'imgly_sticker_emoticons_deceased.svg',
    'imgly_sticker_emoticons_devil.svg',
    'imgly_sticker_emoticons_duckface.svg',
    'imgly_sticker_emoticons_furious.svg',
    'imgly_sticker_emoticons_grin.svg',
    'imgly_sticker_emoticons_guitar.svg',
    'imgly_sticker_emoticons_harry_potter.svg',
    'imgly_sticker_emoticons_hippie.svg',
    'imgly_sticker_emoticons_hitman.svg',
    'imgly_sticker_emoticons_humourous.svg',
    'imgly_sticker_emoticons_idea.svg',
    'imgly_sticker_emoticons_impatient.svg',
    'imgly_sticker_emoticons_kiss.svg',
    'imgly_sticker_emoticons_kisses.svg',
    'imgly_sticker_emoticons_laugh.svg',
    'imgly_sticker_emoticons_loud_cry.svg',
    'imgly_sticker_emoticons_loving.svg',
    'imgly_sticker_emoticons_masked.svg',
    'imgly_sticker_emoticons_music.svg',
    'imgly_sticker_emoticons_nerd.svg',
    'imgly_sticker_emoticons_ninja.svg',
    'imgly_sticker_emoticons_not_speaking_to_you.svg',
    'imgly_sticker_emoticons_pig.svg',
    'imgly_sticker_emoticons_pumpkin.svg',
    'imgly_sticker_emoticons_question.svg',
    'imgly_sticker_emoticons_rabbit.svg',
    'imgly_sticker_emoticons_sad.svg',
    'imgly_sticker_emoticons_sick.svg',
    'imgly_sticker_emoticons_skateboard.svg',
    'imgly_sticker_emoticons_skull.svg',
    'imgly_sticker_emoticons_sleepy.svg',
    'imgly_sticker_emoticons_smile.svg',
    'imgly_sticker_emoticons_smoking.svg',
    'imgly_sticker_emoticons_sobbing.svg',
    'imgly_sticker_emoticons_star.svg',
    'imgly_sticker_emoticons_steaming_furious.svg',
    'imgly_sticker_emoticons_sunbathing.svg',
    'imgly_sticker_emoticons_tired.svg',
    'imgly_sticker_emoticons_tongue_out_wink.svg',
    'imgly_sticker_emoticons_wave.svg',
    'imgly_sticker_emoticons_wide_grin.svg',
    'imgly_sticker_emoticons_wink.svg',
    'imgly_sticker_emoticons_wrestler.svg',
  ],

  florals: [
    'florals_01.svg',
    'florals_02.svg',
    'florals_03.svg',
    'florals_04.svg',
    'florals_05.svg',
    'florals_06.svg',
    'florals_07.svg',
    'florals_08.svg',
    'florals_09.svg',
    'florals_10.svg',
  ],

  hand: [
    'hand_alive.svg',
    'hand_five.svg',
    'hand_friends.svg',
    'hand_fuck.svg',
    'hand_heart.svg',
    'hand_luck.svg',
    'hand_ok.svg',
    'hand_vibes.svg',
  ],

  '3Dstickers': [
    '3d_stickers_astronaut.png',
    '3d_stickers_brain.png',
    '3d_stickers_cube.png',
    '3d_stickers_light.png',
    '3d_stickers_megaphone.png',
    '3d_stickers_pizza.png',
    '3d_stickers_rainbow.png',
    '3d_stickers_thumbs_up.png',
    '3d_stickers_thunder.png',
  ],
};

// ─────────────────────────────────────────────────────────────
// AUTO GENERATE STICKERS
// ─────────────────────────────────────────────────────────────

export const STICKERS: StickerDef[] = Object.entries(STICKER_FILES).flatMap(
  ([category, files]) =>
    files.map((file) => ({
      id: file.replace(/\.(svg|png)$/i, '').replace(/_/g, '-'),

      label: file
        .replace(/\.(svg|png)$/i, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),

      category: category as StickerCategoryType,

      file,
    }))
);

// ─────────────────────────────────────────────────────────────
// CATEGORY ORDER
// ─────────────────────────────────────────────────────────────

const CATEGORY_ORDER: {
  key: StickerCategoryType;
  label: string;
}[] = [
  // { key: 'emoji',      label: 'Emoji'     },
  { key: 'emoticons', label: 'Emoticons' },
  { key: 'craft', label: 'Craft' },
  { key: '3Dstickers', label: '3D Grain' },
  { key: 'hand', label: 'Hands' },
  { key: 'doodle', label: 'Doodle' },
  { key: 'florals', label: 'Florals' },
];

// How many stickers to show when collapsed (one full row of 4)
const COLLAPSED_COUNT = 4;

// ─────────────────────────────────────────────────────────────
// MAIN PANEL
// ─────────────────────────────────────────────────────────────

export function StickersPanel({ onAddSticker }: Props) {
  const [search, setSearch] = useState('');

  const filteredStickers = useMemo(() => {
    if (!search.trim()) return STICKERS;
    const q = search.toLowerCase();
    return STICKERS.filter(
      (sticker) =>
        sticker.label.toLowerCase().includes(q) ||
        sticker.id.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="bg-surface flex h-full flex-col">
      {/* SEARCH */}
      <div className="px-4 pb-2 pt-4">
        <div className="flex items-center rounded-lg border border-[var(--de-color-border)] bg-[color-mix(in_srgb,var(--de-color-text)_5%,transparent)] px-3 py-2 transition-colors focus-within:border-[var(--de-color-primary)]">
          <Search className="mr-2 text-[var(--de-color-text-muted)]" size={14} />
          <input
            className="flex-1 border-none bg-transparent text-sm text-[var(--de-color-text)] outline-none"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stickers..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="scrollbar-hide flex-1 overflow-y-auto px-4 pb-6">
        {CATEGORY_ORDER.map((category) => {
          const stickers = filteredStickers.filter(
            (s) => s.category === category.key
          );
          if (stickers.length === 0) return null;

          return (
            <StickerCategory
              key={category.key}
              onAddSticker={onAddSticker}
              stickers={stickers}
              title={category.label}
            />
          );
        })}

        {filteredStickers.length === 0 && (
          <div className="mt-8 text-center text-sm text-[var(--de-color-text-muted)]">
            No stickers found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CATEGORY
// ─────────────────────────────────────────────────────────────

function StickerCategory({
  title,
  stickers,
  onAddSticker,
}: {
  title: string;
  stickers: StickerDef[];
  onAddSticker: (src: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (stickers.length === 0) return null;

  const hasMore = stickers.length > 0;

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
            {expanded ? 'Less' : `More (${stickers.length})`}

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
          {stickers.map((sticker) => (
            <StickerTile
              key={sticker.id}
              sticker={sticker}
              onClick={() =>
                onAddSticker(
                  `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/stickers/${sticker.category}/${sticker.file}`
                )
              }
            />
          ))}
        </div>
      ) : (
        /* COLLAPSED — horizontal scroll, scrollbar hidden, with arrow hint */
        <ScrollRow onAddSticker={onAddSticker} stickers={stickers} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCROLL ROW  (collapsed horizontal scroll with arrow hint)
// ─────────────────────────────────────────────────────────────

function ScrollRow({
  stickers,
  onAddSticker,
}: {
  stickers: StickerDef[];
  onAddSticker: (src: string) => void;
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
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="shrink-0"
            style={{
              width: 'calc((100% - 24px) / 4)',
            }}
          >
            <StickerTile
              sticker={sticker}
              onClick={() =>
                onAddSticker(
                  `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/stickers/${sticker.category}/${sticker.file}`
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

function StickerTile({
  sticker,
  onClick,
  expanded = false,
}: {
  sticker: StickerDef;
  onClick: () => void;
  expanded?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const imageUrl = `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/stickers/${sticker.category}/${sticker.file}`;

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/x-qqax-type', 'sticker');
    e.dataTransfer.setData('text/x-qqax-sticker-src', imageUrl);
  };

  return (
    <Tooltip placement="top" title={sticker.label}>
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
          alt={sticker.label}
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
