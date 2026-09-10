'use client';

import React from 'react';

import {
  ArrowLeft,
  LayoutGrid,
  Redo,
  Save,
  Settings,
  Undo,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { AD_SIZES } from '../../hooks/useCanvasSize';
import { TOOL_BTN, UnifiedColorPicker } from '../panels/color-picker';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  HDivider,
  Popover,
  Select,
  Switch,
  Tooltip,
} from '../primitives';

import type { CSSProperties } from 'react';

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

const TOOL_BTN_ACTIVE: CSSProperties = {
  ...TOOL_BTN,
  background: 'color-mix(in srgb, var(--de-color-primary) 18%, transparent)',
  color: 'var(--de-color-primary)',
  boxShadow: '0 0 0 1px var(--de-color-primary)',
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

  const settingsContent = (
    <div
      style={{
        width: 230,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: 'var(--de-color-surface)',
        borderRadius: 12,
        padding: 16,
        border: '1px solid var(--de-color-border)',
        boxShadow: '0 10px 30px var(--shadow-color)',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: 'var(--de-color-primary)',
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
          <span style={{ fontSize: 13, color: 'var(--de-color-text)' }}>
            {label}
          </span>
          <Switch
            checked={settings[key]}
            onCheckedChange={(v) => onSettings({ [key]: v })}
          />
        </div>
      ))}
      <div
        style={{ borderTop: '1px solid var(--de-color-border)', paddingTop: 12 }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--de-color-text-muted)',
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
              type="button"
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 8,
                cursor: 'pointer',
                border:
                  settings.railSide === side
                    ? '1.5px solid var(--de-color-primary)'
                    : '1px solid var(--de-color-border)',
                background:
                  settings.railSide === side
                    ? 'color-mix(in srgb, var(--de-color-primary) 18%, transparent)'
                    : 'color-mix(in srgb, var(--de-color-text) 3%, transparent)',
                color:
                  settings.railSide === side
                    ? 'var(--de-color-primary)'
                    : 'var(--de-color-text-muted)',
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
      type="button"
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--de-color-text)';
        e.currentTarget.style.background =
          'color-mix(in srgb, var(--de-color-text) 10%, transparent)';
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
      className="scrollbar-hide z-50 flex h-14 shrink-0 items-center gap-1 overflow-x-auto whitespace-nowrap px-4"
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
        <span
          className="hidden md:inline"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}
        >
          {title || 'Design Studio'}
        </span>
      </div>

      <HDivider />

      {/* Undo / Redo */}
      <Tooltip placement="bottom" title="Undo (Ctrl+Z)">
        <button
          style={TOOL_BTN}
          type="button"
          onClick={() => {
            editor?.history.undo();
          }}
        >
          <Undo size={16} />
        </button>
      </Tooltip>
      <Tooltip placement="bottom" title="Redo (Ctrl+Y)">
        <button
          style={TOOL_BTN}
          type="button"
          onClick={() => {
            editor?.history.redo();
          }}
        >
          <Redo size={16} />
        </button>
      </Tooltip>

      <HDivider />

      {/* Zoom */}
      <Tooltip placement="bottom" title="Zoom out">
        <button
          style={TOOL_BTN}
          type="button"
          onClick={() => {
            editor?.zoom.zoomOut();
          }}
        >
          <ZoomOut size={16} />
        </button>
      </Tooltip>
      <div
        style={{
          minWidth: 50,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--de-color-primary)',
          background:
            'color-mix(in srgb, var(--de-color-primary) 12%, transparent)',
          borderRadius: 7,
          padding: '4px 8px',
          userSelect: 'none',
          border:
            '1px solid color-mix(in srgb, var(--de-color-primary) 25%, transparent)',
        }}
      >
        {zoomPct}%
      </div>
      <Tooltip placement="bottom" title="Zoom in">
        <button
          style={TOOL_BTN}
          type="button"
          onClick={() => {
            editor?.zoom.zoomIn();
          }}
        >
          <ZoomIn size={16} />
        </button>
      </Tooltip>

      <HDivider />

      {/* ── BG + Canvas color pickers ────────────────────────────────────── */}
      <UnifiedColorPicker
        activeObjId={undefined}
        color={canvasBg}
        label="BG"
        onChange={onBgChange}
        tooltip="Outer workspace background"
        variant="tool-bar"
      />
      <UnifiedColorPicker
        activeObjId={undefined}
        color={workspaceBg}
        label="Canvas"
        onChange={onWorkspaceBgChange}
        tooltip="Canvas frame interior color"
        variant="tool-bar"
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
                color: 'var(--de-color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              Custom Canvas Size
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="relative flex-1">
                <input
                  className="w-full rounded-md border border-transparent bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] px-3 py-1.5 text-sm outline-none focus:border-[var(--de-color-primary)]"
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
                  className="w-full rounded-md border border-transparent bg-[color-mix(in_srgb,var(--color-text)_5%,transparent)] px-3 py-1.5 text-sm outline-none focus:border-[var(--de-color-primary)]"
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
        <button style={TOOL_BTN} type="button">
          <Settings size={18} />
        </button>
      </Popover>

      {/* Layers toggle */}
      <Tooltip placement="bottom" title="Toggle layers panel">
        <button
          onClick={onToggleLayers}
          style={layerPanelOpen ? TOOL_BTN_ACTIVE : TOOL_BTN}
          type="button"
        >
          <LayoutGrid size={18} />
        </button>
      </Tooltip>

      <HDivider />

      {/* Save */}
      <button
        disabled={exporting}
        onClick={onExport}
        type="button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: exporting
            ? 'color-mix(in srgb, var(--de-color-primary) 30%, transparent)'
            : 'var(--de-color-primary)',
          border: 'none',
          borderRadius: 10,
          padding: '8px 20px',
          color: 'var(--de-color-primary-fg)',
          fontWeight: 700,
          fontSize: 13,
          cursor: exporting ? 'wait' : 'pointer',
          boxShadow: exporting
            ? 'none'
            : '0 0 20px color-mix(in srgb, var(--de-color-primary) 35%, transparent), 0 4px 12px var(--shadow-color)',
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
