'use client';

import React from 'react';

import { LayoutGrid } from 'lucide-react';

import { TOOL_BTN, UnifiedColorPicker } from '../panels/color-picker';
import { HDivider, Tooltip } from '../primitives';
import { Brand } from './Brand';
import { CanvasSizeSelector } from './CanvasSizeSelector';
import { ExitButton } from './ExitButton';
import { SaveButton } from './SaveButton';
import { CanvasSettings } from './SettingsContent';
import { UndoRedo } from './UndoRedo';
import { UnsavedChangesProtector } from './UnsavedChangesProtector';
import { Zoom } from './Zoom';

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

export function Toolbar({
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
}: Props) {
  return (
    <div
      className="scrollbar-hide z-50 flex h-14 shrink-0 items-center gap-1 overflow-x-auto px-4 whitespace-nowrap"
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
          <UnsavedChangesProtector
            hasUnsavedChanges={hasUnsavedChanges}
            onBack={onBack}
          />
        ) : (
          <ExitButton hasUnsavedChanges={hasUnsavedChanges} onBack={onBack} />
        )
      ) : null}

      <Brand title={title} />

      <HDivider />

      <UndoRedo editor={editor} />

      <HDivider />

      <Zoom editor={editor} zoomPct={zoomPct} />

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

      <CanvasSizeSelector
        customH={customH}
        customOpen={customOpen}
        customW={customW}
        handleApplyCustom={handleApplyCustom}
        handleSizeChange={handleSizeChange}
        setCustomH={setCustomH}
        setCustomOpen={setCustomOpen}
        setCustomW={setCustomW}
        size={size}
      />

      <HDivider />

      <CanvasSettings onSettings={onSettings} settings={settings} />

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
      <SaveButton exporting={exporting} onExport={onExport} />
    </div>
  );
}
