'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { offsetGuides } from '../../../engine';
import { generateId } from '../../../engine/core/utils/id';
import {
  drawRuler,
  placeRulers,
  RULER_SIZE,
  rulerSign,
  rulerZero,
  sidesAt,
} from '../lib';

import type {
  Editor,
  Guide,
  GuideAxis,
  PageOffsets,
  SettingsType,
} from '../../../engine';
import type { RulerSides, ScreenRect } from '../lib';

interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
  frameLeft: number;
  frameTop: number;
  frameWidth: number;
  frameHeight: number;
  width: number;
  height: number;
}

const readViewport = (editor: Editor): Viewport => {
  const { canvas } = editor.canvas;
  const [zoom, , , , panX, panY] = canvas.viewportTransform;
  const { frame } = editor.frame;
  return {
    zoom,
    panX,
    panY,
    frameLeft: frame.left,
    frameTop: frame.top,
    frameWidth: frame.width,
    frameHeight: frame.height,
    width: canvas.width,
    height: canvas.height,
  };
};

const sameViewport = (a: Viewport, b: Viewport) =>
  (Object.keys(a) as (keyof Viewport)[]).every((key) => a[key] === b[key]);

function useViewport(editor: Editor): Viewport {
  const [viewport, setViewport] = useState(() => readViewport(editor));
  useEffect(() => {
    const { canvas } = editor.canvas;
    const update = () =>
      setViewport((prev) => {
        const next = readViewport(editor);
        return sameViewport(prev, next) ? prev : next;
      });
    update();
    canvas.on('after:render', update);
    return () => {
      canvas.off('after:render', update);
    };
  }, [editor]);
  return viewport;
}

/** Part of the container not covered by panels marked `data-canvas-overlay`. */
function measureVisible(container: HTMLElement): ScreenRect {
  const box = container.getBoundingClientRect();
  const visible = { left: 0, top: 0, right: box.width, bottom: box.height };
  const root = container.closest('[data-de-root]') ?? document;
  root.querySelectorAll('[data-canvas-overlay]').forEach((overlay) => {
    const rect = overlay.getBoundingClientRect();
    if (!rect.width || rect.bottom <= box.top || rect.top >= box.bottom) return;
    if ((rect.left + rect.right) / 2 < box.left + box.width / 2) {
      visible.left = Math.max(visible.left, rect.right - box.left);
    } else {
      visible.right = Math.min(visible.right, rect.left - box.left);
    }
  });
  return visible;
}

const GUIDE_COLOR = '#ff3d71';
const OFFSET_COLOR = '#ff9f1a';

interface RulerCanvasProps {
  axis: GuideAxis;
  length: number;
  zero: number;
  zoom: number;
  sign: 1 | -1;
  style: React.CSSProperties;
  onPointerDown: (e: React.PointerEvent) => void;
}

function RulerCanvas({
  axis,
  length,
  zero,
  zoom,
  sign,
  style,
  onPointerDown,
}: RulerCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || length <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    const [w, h] = axis === 'x' ? [length, RULER_SIZE] : [RULER_SIZE, length];
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const styles = getComputedStyle(canvas);
    const color = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    drawRuler(ctx, axis, length, zero, zoom, sign, {
      background: color('--de-color-surface', '#ffffff'),
      tick: color('--de-color-text-muted', '#888888'),
      text: color('--de-color-text-muted', '#888888'),
      border: color('--de-color-border', '#dddddd'),
    });
  }, [axis, length, zero, zoom, sign]);

  return (
    <canvas
      ref={ref}
      aria-label={axis === 'x' ? 'Horizontal ruler' : 'Vertical ruler'}
      onPointerDown={onPointerDown}
      style={{
        position: 'absolute',
        width: axis === 'x' ? length : RULER_SIZE,
        height: axis === 'x' ? RULER_SIZE : length,
        pointerEvents: 'auto',
        cursor: axis === 'x' ? 'row-resize' : 'col-resize',
        ...style,
      }}
    />
  );
}

interface RulersProps {
  editor: Editor;
  guides: Guide[];
  offsets: PageOffsets;
  settings: Pick<SettingsType, 'showRulers' | 'rulerSides' | 'rulerOrigin'>;
  /** Changes whenever the panels over the canvas change */
  layoutKey: string;
  onGuidesChange: (guides: Guide[]) => void;
  onSidesChange: (sides: RulerSides) => void;
}

/**
 * The horizontal ruler creates horizontal guides (axis 'y'), the vertical one
 * vertical guides (axis 'x'); a guide dropped back onto its ruler is removed.
 * The corner square moves both rulers to the quadrant it is dropped in.
 */
export function Rulers({
  editor,
  guides,
  offsets,
  settings,
  layoutKey,
  onGuidesChange,
  onSidesChange,
}: RulersProps) {
  const { showRulers, rulerSides, rulerOrigin } = settings;
  const viewport = useViewport(editor);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<ScreenRect>({
    left: 0,
    top: 0,
    right: viewport.width,
    bottom: viewport.height,
  });
  const [draft, setDraft] = useState<Guide | null>(null);

  const remeasure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const next = measureVisible(container);
    setVisible((prev) =>
      prev.left === next.left &&
      prev.top === next.top &&
      prev.right === next.right &&
      prev.bottom === next.bottom
        ? prev
        : next
    );
  }, []);

  useEffect(() => {
    remeasure();
    const frame = requestAnimationFrame(remeasure);
    window.addEventListener('resize', remeasure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', remeasure);
    };
  }, [remeasure, layoutKey, viewport.width, viewport.height]);

  const { zoom, panX, panY } = viewport;
  const frameSize = {
    width: viewport.frameWidth,
    height: viewport.frameHeight,
  };
  const toScreen = (axis: GuideAxis, position: number) =>
    axis === 'x'
      ? (position + viewport.frameLeft) * zoom + panX
      : (position + viewport.frameTop) * zoom + panY;

  const frameRect: ScreenRect = {
    left: toScreen('x', 0),
    top: toScreen('y', 0),
    right: toScreen('x', viewport.frameWidth),
    bottom: toScreen('y', viewport.frameHeight),
  };
  const placement = placeRulers(frameRect, visible, rulerSides);
  const rulerValue = (guide: Guide) =>
    Math.round(
      (guide.position -
        rulerZero(guide.axis, rulerOrigin, offsets, frameSize)) *
        rulerSign(guide.axis, rulerOrigin)
    );

  const dragGuide = (guide: Guide) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const place = (clientX: number, clientY: number) => {
      const box = container.getBoundingClientRect();
      const x = clientX - box.left;
      const y = clientY - box.top;
      const position =
        guide.axis === 'x'
          ? (x - panX) / zoom - viewport.frameLeft
          : (y - panY) / zoom - viewport.frameTop;
      const onRuler =
        showRulers &&
        (guide.axis === 'x'
          ? x >= placement.left && x <= placement.left + RULER_SIZE
          : y >= placement.top && y <= placement.top + RULER_SIZE);
      return { next: { ...guide, position: Math.round(position) }, onRuler };
    };
    let last = place(e.clientX, e.clientY);
    setDraft(last.next);
    const move = (ev: PointerEvent) => {
      last = place(ev.clientX, ev.clientY);
      setDraft(last.next);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setDraft(null);
      const others = guides.filter((g) => g.id !== guide.id);
      onGuidesChange(last.onRuler ? others : [...others, last.next]);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const dragCorner = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const move = (ev: PointerEvent) => {
      const box = container.getBoundingClientRect();
      const next = sidesAt(
        ev.clientX - box.left,
        ev.clientY - box.top,
        visible
      );
      if (
        next.horizontal !== rulerSides.horizontal ||
        next.vertical !== rulerSides.vertical
      ) {
        onSidesChange(next);
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const userGuides = [
    ...guides.map((guide) => (draft?.id === guide.id ? draft : guide)),
    ...(draft && !guides.some((g) => g.id === draft.id) ? [draft] : []),
  ];

  const renderGuide = (guide: Guide, permanent: boolean) => {
    const pos = toScreen(guide.axis, guide.position);
    const vertical = guide.axis === 'x';
    const color = permanent ? OFFSET_COLOR : GUIDE_COLOR;
    return (
      <div
        key={guide.id}
        aria-label={`${permanent ? 'Offset' : vertical ? 'Vertical' : 'Horizontal'} guide at ${rulerValue(guide)}`}
        onPointerDown={permanent ? undefined : dragGuide(guide)}
        role="separator"
        onDoubleClick={
          permanent
            ? undefined
            : () => onGuidesChange(guides.filter((g) => g.id !== guide.id))
        }
        style={{
          position: 'absolute',
          pointerEvents: permanent ? 'none' : 'auto',
          cursor: vertical ? 'col-resize' : 'row-resize',
          ...(vertical
            ? { top: 0, bottom: 0, left: pos - 3, width: 7 }
            : { left: 0, right: 0, top: pos - 3, height: 7 }),
        }}
      >
        <div
          style={{
            position: 'absolute',
            background: color,
            ...(vertical
              ? { top: 0, bottom: 0, left: 3, width: 1 }
              : { left: 0, right: 0, top: 3, height: 1 }),
          }}
        />
        {draft?.id === guide.id ? (
          <span
            style={{
              position: 'absolute',
              ...(vertical ? { left: 8, top: 28 } : { top: 8, left: 28 }),
              padding: '1px 5px',
              borderRadius: 4,
              background: color,
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {rulerValue(guide)}
          </span>
        ) : null}
      </div>
    );
  };

  const horizontalLength = Math.max(0, visible.right - visible.left);
  const verticalLength = Math.max(0, visible.bottom - visible.top);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 15,
        overflow: 'hidden',
      }}
    >
      {offsetGuides(offsets, viewport.frameWidth, viewport.frameHeight).map(
        (guide) => renderGuide(guide, true)
      )}
      {userGuides.map((guide) => renderGuide(guide, false))}

      {showRulers ? (
        <React.Fragment>
          <RulerCanvas
            axis="x"
            length={horizontalLength}
            sign={rulerSign('x', rulerOrigin)}
            style={{ left: visible.left, top: placement.top }}
            zoom={zoom}
            onPointerDown={dragGuide({
              id: generateId(),
              axis: 'y',
              position: 0,
            })}
            zero={
              toScreen('x', rulerZero('x', rulerOrigin, offsets, frameSize)) -
              visible.left
            }
          />
          <RulerCanvas
            axis="y"
            length={verticalLength}
            sign={rulerSign('y', rulerOrigin)}
            style={{ left: placement.left, top: visible.top }}
            zoom={zoom}
            onPointerDown={dragGuide({
              id: generateId(),
              axis: 'x',
              position: 0,
            })}
            zero={
              toScreen('y', rulerZero('y', rulerOrigin, offsets, frameSize)) -
              visible.top
            }
          />
          <div
            aria-label="Move rulers"
            onPointerDown={dragCorner}
            role="button"
            tabIndex={-1}
            title="Drag to another corner to move the rulers"
            style={{
              position: 'absolute',
              left: placement.left,
              top: placement.top,
              width: RULER_SIZE,
              height: RULER_SIZE,
              pointerEvents: 'auto',
              cursor: 'move',
              background: 'var(--de-color-surface)',
              border: '1px solid var(--de-color-border)',
            }}
          />
        </React.Fragment>
      ) : null}
    </div>
  );
}
