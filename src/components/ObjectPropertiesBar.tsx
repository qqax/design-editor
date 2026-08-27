'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Italic, AlignCenter,
  AlignLeft, AlignRight,
  Bold,
  BringToFront,
  Copy,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Scissors,
  SendToBack,
  Trash2,
} from 'lucide-react';

import { PBtn, PDivider, Popover, Tooltip } from './primitives';
import { FontPickerPopover } from './toolbars/FontPickerPopover';
import { createDefaultFontProvider } from '../providers/defaults/fonts';

const DEFAULT_FONT_PROVIDER = createDefaultFontProvider();

interface Props {
  activeObj: any;
  editor: any;
  removingBg: boolean;
  onRemoveBg: () => void;
}

export function ObjectPropertiesBar({
  activeObj,
  editor,
  removingBg,
  onRemoveBg,
}: Props) {
  const type = activeObj?.type as string | undefined;
  const isImage = type === 'StaticImage' || type === 'BackgroundImage';
  const isText = type === 'StaticText' || type === 'DynamicText';
  const isShape = type === 'StaticPath' || type === 'StaticVector';

  const [opacity, setOpacity] = useState(() =>
    Math.round((activeObj?.opacity ?? 1) * 100)
  );
  useEffect(() => {
    setOpacity(Math.round((activeObj?.opacity ?? 1) * 100));
  }, [activeObj?.id]);

  // ── Text-specific state ──────────────────────────────────────────────────
  const [fontFamily, setFontFamily] = useState<string | undefined>(
    () => activeObj?.fontFamily as string | undefined
  );
  const [charSpacing, setCharSpacing] = useState<number>(
    () => ((activeObj?.charSpacing as number | undefined) ?? 0) / 1000
  );
  const [lineHeight, setLineHeight] = useState<number>(
    () => (activeObj?.lineHeight as number | undefined) ?? 1.2
  );
  type TextTransform = 'none' | 'upper' | 'lower' | 'title';
  const [textTransform, setTextTransform] = useState<TextTransform>('none');
  const originalTextRef = useRef<string | undefined>(undefined);

  // ── Text-editing / per-character selection state ─────────────────────────
  // Tracks the styles of the currently selected characters so the toolbar
  // reflects and applies changes to just the selection.
  const [isEditingText, setIsEditingText] = useState(false);
  const [selStyle, setSelStyle] = useState<Record<string, any>>({});

  // Read selection styles from the active Fabric text object
  const readSelectionStyles = useCallback(() => {
    const obj = activeObj;
    if (!obj?.isEditing) return;
    const selStart: number = obj.selectionStart ?? 0;
    const selEnd: number = obj.selectionEnd ?? 0;
    if (selEnd <= selStart) {
      setSelStyle({});
      return;
    }
    // getSelectionStyles returns an array of per-char style objects; merge/pick first
    const styles: Record<string, any>[] =
      obj.getSelectionStyles?.(selStart, selEnd) ?? [];
    if (!styles.length) {
      setSelStyle({});
      return;
    }
    // Merge: if all chars agree on a value, show it; otherwise show the first
    const merged: Record<string, any> = {};
    const keys = new Set(styles.flatMap((s) => Object.keys(s)));
    keys.forEach((k) => {
      const values = styles.map((s) => s[k]).filter((v) => v !== undefined);
      merged[k] = values[0]; // use first char's value as representative
    });
    setSelStyle(merged);
  }, [activeObj]);

  // Subscribe to Fabric text editing events on the active canvas
  useEffect(() => {
    if (!editor) return;
    const fabricCanvas = editor.canvas?.canvas;
    if (!fabricCanvas) return;

    const onEditingEntered = () => {
      setIsEditingText(true);
      readSelectionStyles();
    };
    const onEditingExited = () => {
      setIsEditingText(false);
      setSelStyle({});
    };
    const onSelectionChanged = () => {
      readSelectionStyles();
    };

    fabricCanvas.on('text:editing:entered', onEditingEntered);
    fabricCanvas.on('text:editing:exited', onEditingExited);
    fabricCanvas.on('text:selection:changed', onSelectionChanged);

    return () => {
      fabricCanvas.off('text:editing:entered', onEditingEntered);
      fabricCanvas.off('text:editing:exited', onEditingExited);
      fabricCanvas.off('text:selection:changed', onSelectionChanged);
    };
  }, [editor, readSelectionStyles]);

  // ── Image-specific state ─────────────────────────────────────────────────
  const [borderRadius, setBorderRadius] = useState<number>(
    () => (activeObj?.rx as number | undefined) ?? 0
  );
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(
    () => !!activeObj?.shadow
  );

  useEffect(() => {
    setFontFamily(activeObj?.fontFamily as string | undefined);
    setCharSpacing(
      ((activeObj?.charSpacing as number | undefined) ?? 0) / 1000
    );
    setLineHeight((activeObj?.lineHeight as number | undefined) ?? 1.2);
    setTextTransform('none');
    originalTextRef.current = undefined;
    // Reset editing state when object changes
    setIsEditingText(false);
    setSelStyle({});
    // Image state
    setBorderRadius((activeObj?.rx as number | undefined) ?? 0);
    setShadowEnabled(!!activeObj?.shadow);
  }, [activeObj?.id]);

  const handleFontChange = useCallback(
    (family: string) => {
      setFontFamily(family);
      editor?.objects.update({ fontFamily: family });
    },
    [editor]
  );

  const handleCharSpacingChange = useCallback(
    (val: number) => {
      const clamped = Math.max(-0.5, Math.min(2, val));
      setCharSpacing(clamped);
      editor?.objects.update({ charSpacing: Math.round(clamped * 1000) });
    },
    [editor]
  );

  const handleLineHeightChange = useCallback(
    (val: number) => {
      const clamped = Math.max(0.5, Math.min(4, val));
      setLineHeight(clamped);
      editor?.objects.update({ lineHeight: clamped });
    },
    [editor]
  );

  const handleTextTransformChange = useCallback(
    (transform: TextTransform) => {
      const currentText = (activeObj?.text as string | undefined) ?? '';
      if (transform !== 'none' && originalTextRef.current === undefined) {
        originalTextRef.current = currentText;
      }
      const base = originalTextRef.current ?? currentText;
      let transformed: string;
      switch (transform) {
        case 'upper':
          transformed = base.toUpperCase();
          break;
        case 'lower':
          transformed = base.toLowerCase();
          break;
        case 'title':
          transformed = base.replace(
            /\w\S*/g,
            (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          );
          break;
        case 'none':
        default:
          transformed = base;
          originalTextRef.current = undefined;
          break;
      }
      setTextTransform(transform);
      editor?.objects.update({ text: transformed });
    },
    [editor, activeObj]
  );

  const handleToggleShadow = useCallback(() => {
    const next = !shadowEnabled;
    setShadowEnabled(next);
    if (next) {
      editor?.objects.update({
        shadow: {
          color: 'rgba(0,0,0,0.35)',
          blur: 12,
          offsetX: 4,
          offsetY: 4,
        },
      });
    } else {
      editor?.objects.update({ shadow: null });
    }
  }, [editor, shadowEnabled]);

  const handleBorderRadius = useCallback(
    (val: number) => {
      setBorderRadius(val);
      editor?.objects.update({ rx: val, ry: val });
    },
    [editor]
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Drag state — null means use default centered position
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).tagName === 'INPUT' ||
      (e.target as HTMLElement).tagName === 'SELECT'
    )
      return;
    e.preventDefault();
    const bar = (e.currentTarget as HTMLDivElement).parentElement!;
    const rect = bar.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
    };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPos({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const label = isImage
    ? 'Image'
    : isText
      ? 'Text'
      : isShape
        ? 'Shape'
        : 'Object';

  const posStyle: React.CSSProperties = isMobile
    ? {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        transform: 'none',
        width: 'auto',
      }
    : pos
      ? {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          transform: 'none',
          bottom: 'auto',
        }
      : {
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
        };

  // ── More popover for text (spacing, leading, case) ───────────────────────
  const textMoreContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '14px 16px',
        minWidth: 220,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        boxShadow: '0 8px 32px var(--shadow-color)',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 11,
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Typography
      </div>
      {/* Letter Spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Letter Spacing
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text)',
              minWidth: 36,
              textAlign: 'right',
            }}
          >
            {charSpacing.toFixed(2)}
          </span>
        </div>
        <input
          max={2}
          min={-0.5}
          onChange={(e) => handleCharSpacingChange(Number(e.target.value))}
          step={0.01}
          type="range"
          value={charSpacing}
          style={{
            width: '100%',
            accentColor: 'var(--color-primary)',
            cursor: 'pointer',
          }}
        />
      </div>
      {/* Line Height */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Line Height
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text)',
              minWidth: 36,
              textAlign: 'right',
            }}
          >
            {lineHeight.toFixed(1)}
          </span>
        </div>
        <input
          max={4}
          min={0.5}
          onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          step={0.1}
          type="range"
          value={lineHeight}
          style={{
            width: '100%',
            accentColor: 'var(--color-primary)',
            cursor: 'pointer',
          }}
        />
      </div>
      {/* Text Transform / Case */}
      <div>
        <span
          style={{
            fontSize: 12,
            color: 'var(--color-text-muted)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Case
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {(
            [
              { value: 'none', label: 'Aa', title: 'Normal' },
              { value: 'upper', label: 'AA', title: 'Uppercase' },
              { value: 'lower', label: 'aa', title: 'Lowercase' },
              { value: 'title', label: 'Tt', title: 'Title Case' },
            ] as { value: TextTransform; label: string; title: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTextTransformChange(opt.value)}
              title={opt.title}
              style={{
                flex: 1,
                height: 30,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                background:
                  textTransform === opt.value
                    ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
                    : 'color-mix(in srgb, var(--color-text) 5%, transparent)',
                border:
                  textTransform === opt.value
                    ? '1.5px solid var(--color-primary)'
                    : '1px solid var(--color-border)',
                color:
                  textTransform === opt.value
                    ? 'var(--color-primary)'
                    : 'var(--color-text-muted)',
                borderRadius: 6,
                outline: 'none',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* Opacity (also available here for convenience) */}
      <div
        style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              Opacity
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-text)',
                minWidth: 36,
                textAlign: 'right',
              }}
            >
              {opacity}%
            </span>
          </div>
          <input
            max={100}
            min={0}
            type="range"
            value={opacity}
            onChange={(e) => {
              const v = Number(e.target.value);
              setOpacity(v);
              editor?.objects.update({ opacity: v / 100 });
            }}
            style={{
              width: '100%',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );

  // ── Image "more" popover ─────────────────────────────────────────────────
  const imageMoreContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '14px 16px',
        minWidth: 220,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        boxShadow: '0 8px 32px var(--shadow-color)',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 11,
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Image Settings
      </div>
      {/* Border radius */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Corner Radius
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text)',
              minWidth: 36,
              textAlign: 'right',
            }}
          >
            {borderRadius}px
          </span>
        </div>
        <input
          max={200}
          min={0}
          onChange={(e) => handleBorderRadius(Number(e.target.value))}
          step={1}
          type="range"
          value={borderRadius}
          style={{
            width: '100%',
            accentColor: 'var(--color-primary)',
            cursor: 'pointer',
          }}
        />
      </div>
      {/* Shadow toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Drop Shadow
        </span>
        <button
          onClick={handleToggleShadow}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
            background: shadowEnabled
              ? 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
              : 'color-mix(in srgb, var(--color-text) 5%, transparent)',
            border: shadowEnabled
              ? '1.5px solid var(--color-primary)'
              : '1px solid var(--color-border)',
            color: shadowEnabled
              ? 'var(--color-primary)'
              : 'var(--color-text-muted)',
            outline: 'none',
            transition: 'all 0.15s',
          }}
        >
          {shadowEnabled ? 'On' : 'Off'}
        </button>
      </div>
      {/* Fit / Fill */}
      <div>
        <span
          style={{
            fontSize: 12,
            color: 'var(--color-text-muted)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Fit Mode
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            {
              label: 'Fit',
              title: 'Fit image inside frame',
              icon: <Minimize2 size={12} />,
            },
            {
              label: 'Fill',
              title: 'Fill frame with image',
              icon: <Maximize2 size={12} />,
            },
          ].map(({ label, title, icon }) => (
            <button
              key={label}
              title={title}
              onClick={() => {
                // Use scaleToFit or scaleToFill patterns
                if (label === 'Fit') {
                  editor?.objects.update({ objectFit: 'contain' });
                } else {
                  editor?.objects.update({ objectFit: 'cover' });
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
              style={{
                flex: 1,
                height: 30,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background:
                  'color-mix(in srgb, var(--color-text) 5%, transparent)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                borderRadius: 6,
                outline: 'none',
                transition: 'all 0.15s',
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
      {/* Opacity */}
      <div
        style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              Opacity
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-text)',
                minWidth: 36,
                textAlign: 'right',
              }}
            >
              {opacity}%
            </span>
          </div>
          <input
            max={100}
            min={0}
            type="range"
            value={opacity}
            onChange={(e) => {
              const v = Number(e.target.value);
              setOpacity(v);
              editor?.objects.update({ opacity: v / 100 });
            }}
            style={{
              width: '100%',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="scrollbar-hide"
      style={{
        ...posStyle,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 10px',
        background: 'color-mix(in srgb, var(--color-surface) 94%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        boxShadow: '0 8px 32px var(--shadow-color)',
        whiteSpace: 'nowrap',
        overflowX: 'visible',
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={onDragStart}
        title="Drag to move"
        style={{
          cursor: 'grab',
          padding: '0 4px',
          color: 'var(--color-text-muted)',
          fontSize: 12,
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        ⠿
      </div>
      {/* Type badge */}
      <div
        style={{
          background:
            'color-mix(in srgb, var(--color-primary) 12%, transparent)',
          borderRadius: 6,
          padding: '3px 9px',
          fontSize: 10,
          fontWeight: 800,
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          flexShrink: 0,
        }}
      >
        {label}
      </div>

      <PDivider />

      {/* Opacity — compact inline (only visible for non-text/image since they have it in More) */}
      {!isText && !isImage && (
        <React.Fragment>
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
          >
            Opacity
          </span>
          <input
            max={100}
            min={0}
            type="range"
            value={opacity}
            onChange={(e) => {
              const v = Number(e.target.value);
              setOpacity(v);
              editor?.objects.update({ opacity: v / 100 });
            }}
            style={{
              width: 72,
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-text)',
              minWidth: 28,
              textAlign: 'right',
            }}
          >
            {opacity}%
          </span>
        </React.Fragment>
      )}

      {/* ── Image controls (compact primary row) ─────────────────────────── */}
      {isImage ? (
        <React.Fragment>
          <Tooltip placement="top" title="Flip horizontal">
            <PBtn
              onClick={() =>
                editor?.objects.update({ flipX: !activeObj?.flipX })
              }
            >
              <FlipHorizontal size={14} />
            </PBtn>
          </Tooltip>
          <Tooltip placement="top" title="Flip vertical">
            <PBtn
              onClick={() =>
                editor?.objects.update({ flipY: !activeObj?.flipY })
              }
            >
              <FlipVertical size={14} />
            </PBtn>
          </Tooltip>
          <PDivider />
          <button
            onClick={onRemoveBg}
            title="Remove image background"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 7,
              cursor: removingBg ? 'wait' : 'pointer',
              fontSize: 11,
              fontWeight: 600,
              background: removingBg
                ? 'color-mix(in srgb, var(--color-text) 5%, transparent)'
                : 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              border: `1px solid ${removingBg ? 'var(--color-border)' : 'var(--color-primary)'}`,
              color: removingBg
                ? 'var(--color-text-muted)'
                : 'var(--color-primary)',
              outline: 'none',
              transition: 'all 0.15s',
            }}
          >
            <Scissors size={13} />
            {removingBg ? 'Removing…' : 'Remove BG'}
          </button>
          <PDivider />
          {/* Image More options */}
          <Popover content={imageMoreContent} placement="top">
            <button
              title="More image options"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 7,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                background:
                  'color-mix(in srgb, var(--color-text) 5%, transparent)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                outline: 'none',
                transition: 'all 0.15s',
              }}
            >
              <MoreHorizontal size={14} />
              <span style={{ fontSize: 10 }}>More</span>
            </button>
          </Popover>
        </React.Fragment>
      ) : null}

      {/* ── Text controls (compact primary row) ────────────────────────────── */}
      {isText ? (
        <React.Fragment>
          {/* Font — show selection style font if editing */}
          <FontPickerPopover
            fontProvider={DEFAULT_FONT_PROVIDER}
            onChange={handleFontChange}
            currentFamily={
              isEditingText && selStyle.fontFamily
                ? selStyle.fontFamily
                : fontFamily
            }
          />
          <PDivider />
          <input
            key={`${activeObj?.id}-fs`}
            max={500}
            min={6}
            title="Font size"
            type="number"
            onChange={(e) =>
              editor?.objects.update({ fontSize: Number(e.target.value) })
            }
            style={{
              width: 46,
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              color: 'var(--color-text)',
              fontSize: 12,
              padding: '4px 4px',
              textAlign: 'center',
              outline: 'none',
            }}
            value={
              isEditingText && selStyle.fontSize != null
                ? selStyle.fontSize
                : (activeObj?.fontSize ?? 32)
            }
          />
          <PDivider />
          {/* Text Color — reflects selection color when editing */}
          <PropertyColorPicker
            activeObjId={activeObj?.id}
            onChange={(c) => editor?.objects.update({ fill: c })}
            tooltip="Text color"
            color={
              isEditingText && typeof selStyle.fill === 'string'
                ? selStyle.fill
                : typeof activeObj?.fill === 'string'
                  ? activeObj.fill
                  : '#000000'
            }
          />
          <PDivider />
          <Tooltip placement="top" title="Bold">
            <PBtn
              active={
                (isEditingText
                  ? selStyle.fontWeight
                  : activeObj?.fontWeight) === 'bold'
              }
              onClick={() =>
                editor?.objects.update({
                  fontWeight:
                    (isEditingText
                      ? selStyle.fontWeight
                      : activeObj?.fontWeight) === 'bold'
                      ? 'normal'
                      : 'bold',
                })
              }
            >
              <Bold size={14} />
            </PBtn>
          </Tooltip>
          <Tooltip placement="top" title="Italic">
            <PBtn
              active={activeObj?.fontStyle === 'italic'}
              onClick={() =>
                editor?.objects.update({
                  fontStyle:
                    activeObj?.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
            >
              <Italic size={14} />
            </PBtn>
          </Tooltip>
          <PDivider />
          <Tooltip placement="top" title="Align left">
            <PBtn
              active={activeObj?.textAlign === 'left'}
              onClick={() => editor?.objects.update({ textAlign: 'left' })}
            >
              <AlignLeft size={14} />
            </PBtn>
          </Tooltip>
          <Tooltip placement="top" title="Align center">
            <PBtn
              active={activeObj?.textAlign === 'center'}
              onClick={() => editor?.objects.update({ textAlign: 'center' })}
            >
              <AlignCenter size={14} />
            </PBtn>
          </Tooltip>
          <Tooltip placement="top" title="Align right">
            <PBtn
              active={activeObj?.textAlign === 'right'}
              onClick={() => editor?.objects.update({ textAlign: 'right' })}
            >
              <AlignRight size={14} />
            </PBtn>
          </Tooltip>
          <PDivider />
          {/* More text options */}
          <Popover content={textMoreContent} placement="top">
            <button
              title="More text options"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 7,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                background:
                  'color-mix(in srgb, var(--color-text) 5%, transparent)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                outline: 'none',
                transition: 'all 0.15s',
              }}
            >
              <MoreHorizontal size={14} />
              <span style={{ fontSize: 10 }}>More</span>
            </button>
          </Popover>
        </React.Fragment>
      ) : null}

      {/* ── Shape controls ─────────────────────────── */}
      {isShape || (!isImage && !isText) ? (
        <React.Fragment>
          <PDivider />
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
          >
            Fill
          </span>
          <PropertyColorPicker
            activeObjId={activeObj?.id}
            onChange={(c) => editor?.objects.update({ fill: c })}
            tooltip="Shape fill color"
            color={
              typeof activeObj?.fill === 'string' ? activeObj.fill : '#7c3aed'
            }
          />
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
          >
            Stroke
          </span>
          <PropertyColorPicker
            activeObjId={activeObj?.id}
            onChange={(c) => editor?.objects.update({ stroke: c })}
            tooltip="Shape stroke color"
            color={
              typeof activeObj?.stroke === 'string' && activeObj.stroke
                ? activeObj.stroke
                : '#ffffff'
            }
          />
          <input
            key={`${activeObj?.id}-sw`}
            defaultValue={activeObj?.strokeWidth ?? 0}
            max={40}
            min={0}
            title="Stroke width"
            type="number"
            onChange={(e) =>
              editor?.objects.update({ strokeWidth: Number(e.target.value) })
            }
            style={{
              width: 44,
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              color: 'var(--color-text)',
              fontSize: 12,
              padding: '4px 6px',
              textAlign: 'center',
              outline: 'none',
            }}
          />
        </React.Fragment>
      ) : null}

      {/* ── Z-order + duplicate + delete — all types ── */}
      <PDivider />
      <Tooltip placement="top" title="Bring forward">
        <PBtn onClick={() => editor?.objects.bringForward()}>
          <BringToFront size={16} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Send backward">
        <PBtn onClick={() => editor?.objects.sendBackwards()}>
          <SendToBack size={16} />
        </PBtn>
      </Tooltip>
      <PDivider />
      <Tooltip placement="top" title="Duplicate">
        <PBtn onClick={() => editor?.objects.clone()}>
          <Copy size={16} />
        </PBtn>
      </Tooltip>
      <Tooltip placement="top" title="Delete (Del)">
        <PBtn danger onClick={() => editor?.objects.remove()}>
          <Trash2 size={16} />
        </PBtn>
      </Tooltip>
    </div>
  );
}

// ─── Modern Property Color Picker (fixed: no nested Radix Tooltip in trigger) ──
const SWATCHES = [
  // Row 1 — Neutrals
  '#ffffff',
  '#f5f5f5',
  '#e0e0e0',
  '#9e9e9e',
  '#616161',
  '#212121',
  '#000000',
  // Row 2 — Warm
  '#ffebee',
  '#ef5350',
  '#e53935',
  '#c62828',
  '#ff7043',
  '#ff8f00',
  '#f9a825',
  // Row 3 — Cool
  '#e8f5e9',
  '#66bb6a',
  '#2e7d32',
  '#26c6da',
  '#0288d1',
  '#1565c0',
  '#7b1fa2',
  // Row 4 — Vibrant
  '#f06292',
  '#ba68c8',
  '#7986cb',
  '#4dd0e1',
  '#4db6ac',
  '#aed581',
  '#fff176',
  // Row 5 — Pastels
  '#fce4ec',
  '#f3e5f5',
  '#e8eaf6',
  '#e1f5fe',
  '#e0f2f1',
  '#f1f8e9',
  '#fffde7',
];

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

interface PropertyColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tooltip: string;
  activeObjId: string;
}

function PropertyColorPicker({
  color,
  onChange,
  tooltip,
  activeObjId,
}: PropertyColorPickerProps) {
  const [hex, setHex] = useState(color);
  const [open, setOpen] = useState(false);

  // Sync hex when color prop or active object changes
  useEffect(() => {
    setHex(color);
  }, [color, activeObjId]);

  const commitHex = useCallback(
    (val: string) => {
      const clean = val.startsWith('#') ? val : `#${val}`;
      if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
        onChange(clean);
        setHex(clean);
      }
    },
    [onChange]
  );

  const pickerContent = (
    <div
      style={{
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '4px 2px',
      }}
    >
      {/* Hue gradient bar */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const hue = Math.round(pct * 360);
          const hex6 = `#${[0, 8, 16]
            .map((s) => {
              const c = Math.round(
                hslToRgb(hue / 360, 1, 0.5)[(s / 8) as 0 | 1 | 2]
              );
              return c.toString(16).padStart(2, '0');
            })
            .join('')}`;
          onChange(hex6);
          setHex(hex6);
        }}
        style={{
          height: 10,
          borderRadius: 6,
          background:
            'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          cursor: 'crosshair',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        }}
      />

      {/* Swatches Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
        }}
      >
        {SWATCHES.map((sw) => (
          <button
            key={sw}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title={sw}
            onClick={() => {
              onChange(sw);
              setHex(sw);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'scale(1.15)')
            }
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 6,
              border:
                color.toLowerCase() === sw.toLowerCase()
                  ? '2px solid var(--color-primary)'
                  : '1px solid rgba(0,0,0,0.12)',
              background: sw,
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          />
        ))}
      </div>

      {/* Hex + native color input */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: color,
              border: '1.5px solid var(--color-border)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => {
              onChange(e.target.value);
              setHex(e.target.value);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              padding: 0,
              border: 'none',
            }}
          />
        </div>
        <input
          maxLength={7}
          onBlur={(e) => commitHex(e.target.value)}
          onChange={(e) => setHex(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
          spellCheck={false}
          value={hex}
          onBlurCapture={(e) =>
            (e.target.style.borderColor = 'var(--color-border)')
          }
          onKeyDown={(e) =>
            e.key === 'Enter' && commitHex((e.target as HTMLInputElement).value)
          }
          style={{
            flex: 1,
            height: 34,
            border: '1.5px solid var(--color-border)',
            borderRadius: 8,
            padding: '0 8px',
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 600,
            letterSpacing: '0.04em',
            background:
              'color-mix(in srgb, var(--color-text) 4%, var(--color-surface))',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />
      </div>
    </div>
  );

  // KEY FIX: Popover wraps the button directly, NO nested Radix Tooltip inside trigger.
  // The tooltip is now done with the native `title` attribute on the button,
  // avoiding the Radix nested trigger/portal click-blocking issue.
  return (
    <Popover
      content={pickerContent}
      onOpenChange={setOpen}
      open={open}
      placement="top"
    >
      <button
        title={tooltip}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor =
              'color-mix(in srgb, var(--color-text) 30%, var(--color-border))';
            e.currentTarget.style.background =
              'color-mix(in srgb, var(--color-text) 4%, var(--color-bg))';
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.background = 'var(--color-bg)';
          }
        }}
        style={{
          height: 30,
          width: 38,
          padding: 3,
          borderRadius: 8,
          border: open
            ? '1.5px solid var(--color-primary)'
            : '1px solid var(--color-border)',
          background: open
            ? 'color-mix(in srgb, var(--color-primary) 8%, var(--color-bg))'
            : 'var(--color-bg)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease',
          outline: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 5,
            border: '1px solid rgba(0,0,0,0.12)',
            background: color,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
          }}
        />
      </button>
    </Popover>
  );
}
