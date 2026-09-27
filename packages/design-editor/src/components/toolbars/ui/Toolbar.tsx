'use client';

import React from 'react';

import { LayoutGrid } from 'lucide-react';

import { Brand } from './Brand';
import { CanvasSizeSelector } from './CanvasSizeSelector';
import { ExitButton } from './ExitButton';
import { ExportDialog } from './ExportDialog';
import { CanvasSettings } from './SettingsContent';
import { UndoRedo } from './UndoRedo';
import { UnsavedChangesProtector } from './UnsavedChangesProtector';
import { Zoom } from './Zoom';
import { useMessages } from '../../../messages';
import { UnifiedColorPicker } from '../../panels';
import { HDivider, Tooltip } from '../../primitives';

import type {
  CanvasBackground,
  Editor,
  ExportOptions,
  PageOffsets,
  SettingsType,
} from '../../../engine';
import type { SelectOptions } from '../../primitives';
import type { ExportTarget } from '../model';

interface Props {
  editor: Editor | null;
  zoomPct: number;
  layerPanelOpen: boolean;
  onToggleLayers: () => void;
  canSaveToLibrary: boolean;
  onExport: (options: ExportOptions, target: ExportTarget) => Promise<boolean>;
  onBack?: () => void;
  settings: SettingsType;
  onSettings: (patch: Partial<SettingsType>) => void;
  offsets: PageOffsets;
  onOffsetsChange: (offsets: PageOffsets) => void;
  /** Omit to hide the theme switcher */
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  canvasBg: CanvasBackground;
  onBgChange: (background: CanvasBackground) => void;
  workspaceBg: string;
  onWorkspaceBgChange: (color: string) => void;
  title?: React.ReactNode;
  hasUnsavedChanges?: boolean;
  adSizes?: SelectOptions;
}

export function Toolbar({
  editor,
  zoomPct,
  layerPanelOpen,
  onToggleLayers,
  canSaveToLibrary,
  onExport,
  onBack,
  settings,
  onSettings,
  offsets,
  onOffsetsChange,
  theme,
  onThemeChange,
  canvasBg,
  onBgChange,
  workspaceBg,
  onWorkspaceBgChange,
  title,
  hasUnsavedChanges,
  adSizes,
}: Props) {
  const m = useMessages().toolbar;
  return (
    <div className="de-toolbar scrollbar-hide">
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
        alpha
        activeObjId={undefined}
        gradient={typeof canvasBg === 'string' ? null : canvasBg}
        label={m.background}
        onChange={onBgChange}
        onGradientChange={onBgChange}
        tooltip={m.backgroundHint}
        variant="tool-bar"
        color={
          typeof canvasBg === 'string'
            ? canvasBg
            : (canvasBg.stops[0]?.color ?? '#ffffff')
        }
      />
      <UnifiedColorPicker
        activeObjId={undefined}
        color={workspaceBg}
        emptySwatch="var(--de-color-workspace)"
        label={m.workspace}
        onChange={onWorkspaceBgChange}
        tooltip={m.workspaceHint}
        variant="tool-bar"
      />

      <div className="de-spacer" />

      <CanvasSizeSelector adSizes={adSizes} editor={editor} />

      <HDivider />

      <CanvasSettings
        offsets={offsets}
        onOffsetsChange={onOffsetsChange}
        onSettings={onSettings}
        onThemeChange={onThemeChange}
        settings={settings}
        theme={theme}
      />

      {/* Layers toggle */}
      <Tooltip placement="bottom" title={m.layersHint}>
        <button
          aria-label={m.layers}
          aria-pressed={layerPanelOpen}
          className="de-tool-btn"
          data-active={layerPanelOpen}
          onClick={onToggleLayers}
          type="button"
        >
          <LayoutGrid size={18} />
        </button>
      </Tooltip>

      <HDivider />

      <ExportDialog
        canSaveToLibrary={canSaveToLibrary}
        editor={editor}
        offsets={offsets}
        onExport={onExport}
      />
    </div>
  );
}
