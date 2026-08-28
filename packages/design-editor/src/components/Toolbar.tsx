'use client';

import type {CSSProperties} from 'react';
import React, {useCallback, useEffect, useState} from 'react';

import {ArrowLeft, LayoutGrid, Redo, Save, Settings, Undo, ZoomIn, ZoomOut,} from 'lucide-react';

import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
    HDivider,
    Popover,
    Select,
    Switch,
    Tooltip,
} from './primitives';
import {AD_SIZES} from '../hooks/useCanvasSize';

interface Props {
  editor: any;
  zoomPct: number;
  size: string;
  customOpen: boolean;
  setCustomOpen: (v: boolean) => void;
  customW: number;
  setCustomW: (v: number) => void;
  customH: number;
  setCustomH: (v: number) => void;
  handleSizeChange: (v: string) => void;
  handleApplyCustom: () => void;
  layerPanelOpen: boolean;
  onToggleLayers: () => void;
  exporting: boolean;
  onExport: () => void;
  onBack?: () => void;
  settings?: any;
  onSettings: (patch: Partial<any>) => void;
  canvasBg: string;
  onBgChange: (color: string) => void;
  workspaceBg: string;
  onWorkspaceBgChange: (color: string) => void;
  title?: React.ReactNode;
  hasUnsavedChanges?: boolean;
}

const TOOL_BTN: CSSProperties = {
  width: 34,
  height: 34,
  border: 'none',
  borderRadius: 9,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  background: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
  color: 'var(--color-text-muted)',
  transition: 'all 0.15s',
  outline: 'none',
};

const TOOL_BTN_ACTIVE: CSSProperties = {
  ...TOOL_BTN,
  background: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
  color: 'var(--color-primary)',
  boxShadow: '0 0 0 1px var(--color-primary)',
};

export function Toolbar(props: Props) {
  const {
    editor,
    zoomPct,
    size,
    customOpen,
    setCustomOpen,
    customW,
    setCustomW,
    customH,
    setCustomH,
    handleSizeChange,
    handleApplyCustom,
    layerPanelOpen,
    onToggleLayers,
    exporting,
    onExport,
    onBack,
    settings,
    onSettings,
    canvasBg,
    onBgChange,
    workspaceBg,
    onWorkspaceBgChange,
    title,
    hasUnsavedChanges,
  } = props;
  console.log('DEBUG Toolbar dependencies:', {
    Tooltip,
    Select,
    Popover,
    Button,
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogOverlay,
    Switch,
    ArrowLeft,
    Undo,
    Redo,
    ZoomIn,
    ZoomOut,
    Save,
    LayoutGrid,
    Settings,
    HDivider,
  });
  const settingsContent = (
    <div
      style={{
        width: 230,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: 'var(--color-surface)',
        borderRadius: 12,
        padding: 16,
        border: '1px solid var(--color-border)',
        boxShadow: '0 10px 30px var(--shadow-color)',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Editor Settings
      </div>
      {[
        { label: 'Grid overlay', key: 'showGrid' as const },
        { label: 'Snap to grid', key: 'snapGrid' as const },
      ].map(({ label, key }) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--color-text)' }}>
            {label}
          </span>
          <Switch
            checked={settings[key]}
            onCheckedChange={(v) => onSettings({ [key]: v })}
          />
        </div>
      ))}
      <div
        style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--color-text-muted)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Panel Rail
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['left', 'right'] as const).map((side) => (
            <button
              key={side}
              onClick={() => onSettings({ railSide: side })}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 8,
                cursor: 'pointer',
                border:
                  settings.railSide === side
                    ? '1.5px solid var(--color-primary)'
                    : '1px solid var(--color-border)',
                background:
                  settings.railSide === side
                    ? 'color-mix(in srgb, var(--color-primary) 18%, transparent)'
                    : 'color-mix(in srgb, var(--color-text) 3%, transparent)',
                color:
                  settings.railSide === side
                    ? 'var(--color-primary)'
                    : 'var(--color-text-muted)',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'capitalize',
                outline: 'none',
              }}
            >
              {side}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const exitButton = (
    <button
      onClick={!hasUnsavedChanges ? onBack : undefined}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--color-text)';
        e.currentTarget.style.background =
          'color-mix(in srgb, var(--color-text) 10%, transparent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--color-text-muted)';
        e.currentTarget.style.background =
          'color-mix(in srgb, var(--color-text) 5%, transparent)';
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        background: 'color-mix(in srgb, var(--color-text) 5%, transparent)',
        border: '1px solid var(--color-border)',
        borderRadius: 9,
        padding: '6px 13px',
        cursor: 'pointer',
        color: 'var(--color-text-muted)',
        fontSize: 12,
        fontWeight: 600,
        transition: 'all 0.15s',
        outline: 'none',
      }}
    >
      <ArrowLeft size={14} /> <span className="hidden md:inline">Exit</span>
    </button>
  );

  return (
    <div
      className="scrollbar-hide z-50 flex h-[56px] shrink-0 items-center gap-1 overflow-x-auto whitespace-nowrap px-[16px]"
      style={{
        background: 'color-mix(in srgb, var(--color-surface) 96%, transparent)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow:
          '0 1px 0 var(--color-border), 0 4px 20px var(--shadow-color)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {onBack ? (
        hasUnsavedChanges ? (
          <Dialog>
            <DialogTrigger asChild>{exitButton}</DialogTrigger>
            <DialogContent className="max-w-md p-6">
              <DialogTitle className="mb-2 text-lg font-semibold text-[var(--color-text)]">
                Leave without saving?
              </DialogTitle>
              <DialogDescription className="mb-6 text-[var(--color-text-muted)]">
                Any unsaved changes will be lost.
              </DialogDescription>
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button size="md" variant="secondary">
                    Stay
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={onBack} size="md" variant="primary">
                    Exit
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          exitButton
        )
      ) : null}

      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginLeft: 8,
          marginRight: 4,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background:
              'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          A
        </div>
        <span
          className="hidden md:inline"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}
        >
          {title || 'FastlabAI Design Studio'}
        </span>
      </div>

      <HDivider />

      {/* Undo / Redo */}
      <Tooltip placement="bottom" title="Undo (Ctrl+Z)">
        <button onClick={() => editor?.history.undo()} style={TOOL_BTN}>
          <Undo size={16} />
        </button>
      </Tooltip>
      <Tooltip placement="bottom" title="Redo (Ctrl+Y)">
        <button onClick={() => editor?.history.redo()} style={TOOL_BTN}>
          <Redo size={16} />
        </button>
      </Tooltip>

      <HDivider />

      {/* Zoom */}
      <Tooltip placement="bottom" title="Zoom out">
        <button onClick={() => editor?.zoom.zoomOut()} style={TOOL_BTN}>
          <ZoomOut size={16} />
        </button>
      </Tooltip>
      <div
        style={{
          minWidth: 50,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--color-primary)',
          background:
            'color-mix(in srgb, var(--color-primary) 12%, transparent)',
          borderRadius: 7,
          padding: '4px 8px',
          userSelect: 'none',
          border:
            '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
        }}
      >
        {zoomPct}%
      </div>
      <Tooltip placement="bottom" title="Zoom in">
        <button onClick={() => editor?.zoom.zoomIn()} style={TOOL_BTN}>
          <ZoomIn size={16} />
        </button>
      </Tooltip>

      <HDivider />

      {/* ── BG + Canvas color pickers ────────────────────────────────────── */}
      <ColorPickerBtn
        checkerboard
        color={canvasBg}
        label="BG"
        onChange={onBgChange}
        tooltip="Outer workspace background"
      />
      <ColorPickerBtn
        color={workspaceBg}
        label="Canvas"
        onChange={onWorkspaceBgChange}
        tooltip="Canvas frame interior color"
      />

      <div style={{ flex: 1 }} />

      {/* Canvas size selector */}
      <Popover
        onOpenChange={(open) => !open && setCustomOpen(false)}
        open={customOpen}
        placement="bottom"
        content={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: 220,
              padding: 4,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 12,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              Custom Canvas Size
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="relative flex-1">
                <input
                  className="w-full rounded-md border border-transparent bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                  max={8000}
                  min={100}
                  onChange={(e) => setCustomW(Number(e.target.value) || 100)}
                  placeholder="Width"
                  type="number"
                  value={customW}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                  px
                </span>
              </div>
              <span
                style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}
              >
                ×
              </span>
              <div className="relative flex-1">
                <input
                  className="w-full rounded-md border border-transparent bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
                  max={8000}
                  min={100}
                  onChange={(e) => setCustomH(Number(e.target.value) || 100)}
                  placeholder="Height"
                  type="number"
                  value={customH}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                  px
                </span>
              </div>
            </div>
            <Button
              onClick={handleApplyCustom}
              size="sm"
              style={{ width: '100%' }}
              variant="primary"
            >
              Apply
            </Button>
          </div>
        }
      >
        <Select
          className="studio-size-select flex-1 md:flex-none"
          onValueChange={handleSizeChange}
          options={AD_SIZES}
          style={{ width: 'auto', minWidth: 160, maxWidth: 220 }}
          value={size}
        />
      </Popover>

      <HDivider />

      {/* Settings */}
      <Popover content={settingsContent} placement="bottom">
        <button style={TOOL_BTN}>
          <Settings size={18} />
        </button>
      </Popover>

      {/* Layers toggle */}
      <Tooltip placement="bottom" title="Toggle layers panel">
        <button
          onClick={onToggleLayers}
          style={layerPanelOpen ? TOOL_BTN_ACTIVE : TOOL_BTN}
        >
          <LayoutGrid size={18} />
        </button>
      </Tooltip>

      <HDivider />

      {/* Save */}
      <button
        disabled={exporting}
        onClick={onExport}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: exporting
            ? 'color-mix(in srgb, var(--color-primary) 30%, transparent)'
            : 'var(--color-primary)',
          border: 'none',
          borderRadius: 10,
          padding: '8px 20px',
          color: 'var(--color-primary-text)',
          fontWeight: 700,
          fontSize: 13,
          cursor: exporting ? 'wait' : 'pointer',
          boxShadow: exporting
            ? 'none'
            : '0 0 20px color-mix(in srgb, var(--color-primary) 35%, transparent), 0 4px 12px var(--shadow-color)',
          transition: 'all 0.2s',
          letterSpacing: '-0.01em',
          outline: 'none',
        }}
      >
        <Save size={16} />
        <span className="hidden md:inline">
          {exporting ? 'Saving…' : 'Save to Library'}
        </span>
        <span className="md:hidden">{exporting ? '…' : 'Save'}</span>
      </button>
    </div>
  );
}

// ─── Modern Color Picker Button ───────────────────────────────────────────────
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

function ColorPickerBtn({
  color,
  onChange,
  label,
  tooltip,
  checkerboard,
}: {
  color: string;
  onChange: (c: string) => void;
  label: string;
  tooltip: string;
  checkerboard?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(color);

  // Sync hex when color prop changes externally
  useEffect(() => {
    setHex(color);
  }, [color]);

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
      {/* ── Gradient hue bar (click to pick a hue quickly) ─────────────── */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const hue = Math.round(pct * 360);
          const hex6 = `#${[0, 8, 16]
            .map((s) => {
              const c = Math.round(hslToRgb(hue / 360, 1, 0.5)[s / 8]);
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

      {/* ── Swatch palette ──────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 8,
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
              (e.currentTarget.style.transform = 'scale(1.2)')
            }
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              border:
                color.toLowerCase() === sw.toLowerCase()
                  ? '2px solid var(--color-primary)'
                  : '1.5px solid color-mix(in srgb, var(--color-text) 10%, transparent)',
              background: sw,
              cursor: 'pointer',
              transition:
                'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s',
              boxShadow:
                color.toLowerCase() === sw.toLowerCase()
                  ? '0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary)'
                  : '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
        ))}
      </div>

      {/* ── Hex input + native picker ───────────────────────────────────── */}
      <div
        style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: color,
              border:
                '2px solid color-mix(in srgb, var(--color-text) 8%, transparent)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
        <div style={{ position: 'relative', flex: 1 }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}
          >
            #
          </span>
          <input
            maxLength={6}
            onBlur={(e) => commitHex(e.target.value)}
            onChange={(e) => setHex(e.target.value)}
            spellCheck={false}
            value={hex.replace(/^#/, '')}
            onBlurCapture={(e) =>
              (e.target.style.boxShadow = 'inset 0 0 0 1px transparent')
            }
            onFocus={(e) =>
              (e.target.style.boxShadow =
                'inset 0 0 0 2px var(--color-primary)')
            }
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              commitHex((e.target as HTMLInputElement).value)
            }
            style={{
              width: '100%',
              height: 40,
              boxSizing: 'border-box',
              border: 'none',
              borderRadius: 10,
              padding: '0 12px 0 28px',
              fontSize: 14,
              fontFamily: 'var(--de-font-mono, monospace)',
              fontWeight: 600,
              textTransform: 'uppercase',
              background:
                'color-mix(in srgb, var(--color-text) 5%, transparent)',
              color: 'var(--color-text)',
              outline: 'none',
              transition: 'box-shadow 0.2s',
              boxShadow: 'inset 0 0 0 1px transparent',
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      content={pickerContent}
      onOpenChange={setOpen}
      open={open}
      placement="bottom"
    >
      <div style={{ display: 'inline-block' }}>
        <Tooltip placement="bottom" title={tooltip}>
          <button
            style={{
              ...TOOL_BTN,
              padding: '4px 8px',
              gap: 6,
              width: 'auto',
              background: open
                ? 'color-mix(in srgb, var(--color-primary) 18%, transparent)'
                : TOOL_BTN.background,
              boxShadow: open ? '0 0 0 1px var(--color-primary)' : 'none',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 18,
                height: 18,
                borderRadius: 5,
                border: '1.5px solid rgba(0,0,0,0.15)',
                background: checkerboard
                  ? `linear-gradient(${color}, ${color}), repeating-conic-gradient(#bbb 0% 25%, #fff 0% 50%) 0 0 / 8px 8px`
                  : color,
                flexShrink: 0,
                boxShadow: '0 1px 5px rgba(0,0,0,0.22)',
                overflow: 'hidden',
              }}
            />
            <span
              className="hidden md:inline"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--color-text-muted)',
              }}
            >
              {label}
            </span>
          </button>
        </Tooltip>
      </div>
    </Popover>
  );
}

// Minimal HSL→RGB helper for the hue gradient bar clicks
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
