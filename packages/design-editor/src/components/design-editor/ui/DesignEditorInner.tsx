import React, { useEffect, useRef, useState } from 'react';

import { DevelopmentBadge } from './DevelopmentBadge';
import { EditorSidebar } from './EditorSidebar';
import {
  NO_OFFSETS,
  useActiveObject,
  useEditor,
  useZoomRatio,
} from '../../../engine';
import {
  clearAutosave,
  loadAutosave,
  restoreViewport,
  useAutoSave,
} from '../../../hooks/useAutoSave';
import { useStudioExport } from '../../../hooks/useStudioExport';
import { useToast } from '../../../hooks/useToast';
import { CanvasArea, Rulers } from '../../canvas';
import { useEditorContext } from '../../EditorContext';
import { IconRail } from '../../icon-reail';
import { LayerPanel } from '../../layers';
import { ObjectPropertiesBar } from '../../object-properties';
import { Toolbar } from '../../toolbars';
import { getStorageSafe, setStorageSafe } from '../lib';
import { useCanvasDrop, useCanvasPanning, useEditorActions } from '../model';

import type { FabricImage } from 'fabric';

import type {
  CanvasBackground,
  Guide,
  PageOffsets,
  SettingsType,
} from '../../../engine';
import type { PanelKey, PanelsConfigType } from '../../panels';
import type { RenderPropType } from '../../panels/common/model/types';
import type { SelectOptions } from '../../primitives';

const WORKSPACE_BG = 'var(--de-color-bg)';

interface DesignEditorInnerProps {
  initialScene?: any;
  className?: string;
  templatesPanel?: RenderPropType;
  libraryPanel?: RenderPropType;
  title?: React.ReactNode;
  adSizes?: SelectOptions;
  panelsConfig?: PanelsConfigType;
}

export function DesignEditorInner({
  initialScene,
  className,
  templatesPanel,
  libraryPanel,
  title,
  adSizes,
  panelsConfig,
}: DesignEditorInnerProps) {
  const editor = useEditor();
  const activeObj = useActiveObject<FabricImage>();
  const zoomRatio = useZoomRatio<number>();
  const message = useToast();
  const { exportToLibrary, exporting } = useStudioExport();
  const { backgroundRemovalProvider, sceneKey, onBack } = useEditorContext();

  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [canvasBg, setCanvasBg] = useState<CanvasBackground>(
    () =>
      (initialScene?.canvasBg as CanvasBackground | undefined) ||
      getStorageSafe<CanvasBackground>('studio_canvasBg', '#ffffff')
  );

  const [workspaceBg, setWorkspaceBg] = useState<string>(
    () =>
      (initialScene?.workspaceBg ||
        getStorageSafe<string>('studio_workspaceBg', '#f5f5f5')) as string
  );

  const [settings, setSettings] = useState<SettingsType>(() => ({
    showGrid: false,
    snapGrid: false,
    showRulers: false,
    snapToGuides: true,
    rulerSides: { horizontal: 'top', vertical: 'left' },
    rulerOrigin: { x: 'left', y: 'top' },
    railSide: 'left',
    ...getStorageSafe<Partial<SettingsType>>('studio_settings', {}),
  }));

  useEffect(() => {
    setStorageSafe('studio_settings', settings);
  }, [settings]);

  const rulersKey = sceneKey ? `studio_rulers_${sceneKey}` : 'studio_rulers';
  const [rulers, setRulers] = useState<{
    guides: Guide[];
    offsets: PageOffsets;
  }>(() => ({
    guides: [],
    offsets: NO_OFFSETS,
    ...getStorageSafe<Partial<{ guides: Guide[]; offsets: PageOffsets }>>(
      rulersKey,
      {}
    ),
  }));

  useEffect(() => {
    setStorageSafe(rulersKey, rulers);
    editor?.guides.setGuides(rulers.guides);
    editor?.guides.setOffsets(rulers.offsets);
  }, [editor, rulers, rulersKey]);

  useEffect(() => {
    editor?.guides.setSnapping(settings.snapToGuides);
  }, [editor, settings.snapToGuides]);

  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const { hasUnsavedChanges, setHasUnsavedChanges } = useAutoSave(
    editor,
    canvasBg,
    workspaceBg,
    sceneKey
  );

  const {
    removingBg,
    shimmerRect,
    handleAddMedia,
    addImageToCanvas,
    handleAddText,
    handleApplyTextDesign,
    handleApplyTemplate,
    handleRemoveBg,
    handleExport,
  } = useEditorActions(
    editor,
    activeObj,
    sceneKey,
    backgroundRemovalProvider,
    exportToLibrary,
    message,
    setCanvasBg,
    setWorkspaceBg,
    setHasUnsavedChanges
  );

  const {
    spaceDown,
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasPanning(editor);

  const { dragOver, setDragOver, handleDrop } = useCanvasDrop(
    editor,
    addImageToCanvas,
    handleAddMedia
  );

  useEffect(() => {
    if (editor && canvasBg) {
      try {
        editor.frame.setBackground(canvasBg);
      } catch {
        // console.error(e);
      }
    }
  }, [editor, canvasBg]);

  useEffect(() => {
    if (!editor) return;

    // The restore below is async (fonts + images). If this effect is torn down
    // and re-run — or the user applies a template while it is still in flight —
    // the late continuation must not write the *previous* scene's background
    // colour onto the canvas, which left the select showing the new colour
    // while the canvas still rendered the old one.
    let cancelled = false;

    const saved = loadAutosave(sceneKey);
    const processScene = (sceneData: any, bgSrc: any) => {
      void editor.scene
        .importFromJSON(sceneData)
        .catch(() => {})
        .then(() => {
          if (cancelled) return;
          if (bgSrc?.canvasBg) {
            try {
              editor.frame.setBackground(bgSrc.canvasBg as CanvasBackground);
            } catch {
              /* empty */
            }
          }
          // After the zoomToFit calls in importFromJSON and Frame.initialize
          setTimeout(() => {
            if (cancelled) return;
            if (bgSrc?.viewport) restoreViewport(editor, bgSrc.viewport);
            editor.history.reset();
            editor.history.initialize();
            setHasUnsavedChanges(false);
          }, 50);
        });
    };

    if (saved && Object.keys(saved).length > 0) {
      if (saved.scene) processScene(saved.scene, saved);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved.canvasBg) setCanvasBg(saved.canvasBg);
      if (saved.workspaceBg) setWorkspaceBg(saved.workspaceBg);
    } else if (initialScene) {
      const scene = initialScene.scene || initialScene;
      processScene(scene, initialScene);
      if (initialScene.canvasBg) setCanvasBg(initialScene.canvasBg);
      if (initialScene.workspaceBg) setWorkspaceBg(initialScene.workspaceBg);
    }

    const handleChange = () => setHasUnsavedChanges(true);
    editor.on('history:changed', handleChange);
    return () => {
      cancelled = true;
      editor.off('history:changed', handleChange);
    };
  }, [editor, initialScene, setHasUnsavedChanges, sceneKey]);

  const zoomPct = Math.round(zoomRatio * 100);

  return (
    <div
      data-de-root
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--de-color-bg)',
        color: 'var(--de-color-fg)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          display: 'flex',
          flexDirection: 'column',
          background: WORKSPACE_BG,
        }}
      >
        <Toolbar
          adSizes={adSizes}
          canvasBg={canvasBg}
          editor={editor}
          exporting={exporting}
          hasUnsavedChanges={hasUnsavedChanges}
          layerPanelOpen={layerPanelOpen}
          offsets={rulers.offsets}
          onBgChange={setCanvasBg}
          onExport={handleExport}
          onSettings={(patch) => setSettings((p) => ({ ...p, ...patch }))}
          onToggleLayers={() => setLayerPanelOpen((p) => !p)}
          onWorkspaceBgChange={setWorkspaceBg}
          settings={settings}
          title={title}
          workspaceBg={workspaceBg}
          zoomPct={zoomPct}
          onBack={
            onBack
              ? () => {
                  clearAutosave(sceneKey);
                  onBack();
                }
              : undefined
          }
          onOffsetsChange={(offsets) =>
            setRulers((prev) => ({ ...prev, offsets }))
          }
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {settings.railSide === 'left' ? (
            <React.Fragment>
              <IconRail
                activePanel={activePanel}
                onTogglePanel={setActivePanel}
                panelsConfig={panelsConfig}
                side={settings.railSide}
              />
              <EditorSidebar
                activePanel={activePanel}
                addImageToCanvas={addImageToCanvas}
                handleAddMedia={handleAddMedia}
                handleAddText={handleAddText}
                handleApplyTemplate={handleApplyTemplate}
                handleApplyTextDesign={handleApplyTextDesign}
                libraryPanel={libraryPanel}
                onClose={() => setActivePanel(null)}
                templatesPanel={templatesPanel}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <EditorSidebar
                activePanel={activePanel}
                addImageToCanvas={addImageToCanvas}
                handleAddMedia={handleAddMedia}
                handleAddText={handleAddText}
                handleApplyTemplate={handleApplyTemplate}
                handleApplyTextDesign={handleApplyTextDesign}
                libraryPanel={libraryPanel}
                onClose={() => setActivePanel(null)}
                templatesPanel={templatesPanel}
              />
              <IconRail
                activePanel={activePanel}
                onTogglePanel={setActivePanel}
                side={settings.railSide}
              />
            </React.Fragment>
          )}

          <div
            ref={canvasWrapRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              cursor: spaceDown ? (isPanning ? 'grabbing' : 'grab') : 'default',
            }}
          >
            <CanvasArea
              canvasBg={canvasBg}
              dragOver={dragOver}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              settings={settings}
              workspaceBg={workspaceBg}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
            />

            {editor ? (
              <Rulers
                editor={editor}
                guides={rulers.guides}
                layoutKey={`${settings.railSide}-${activePanel ?? ''}`}
                offsets={rulers.offsets}
                settings={settings}
                onGuidesChange={(guides) =>
                  setRulers((prev) => ({ ...prev, guides }))
                }
                onSidesChange={(rulerSides) =>
                  setSettings((prev) => ({ ...prev, rulerSides }))
                }
              />
            ) : null}

            {removingBg && shimmerRect ? (
              <div
                style={{
                  position: 'absolute',
                  top: shimmerRect.top,
                  left: shimmerRect.left,
                  width: shimmerRect.width,
                  height: shimmerRect.height,
                  pointerEvents: 'none',
                  zIndex: 20,
                  borderRadius: 4,
                  overflow: 'hidden',
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            ) : null}

            <DevelopmentBadge />
          </div>

          {layerPanelOpen ? (
            <LayerPanel
              editor={editor}
              onClose={() => setLayerPanelOpen(false)}
            />
          ) : null}
        </div>
      </div>

      <ObjectPropertiesBar
        activeObj={activeObj}
        editor={editor}
        onRemoveBg={handleRemoveBg}
        removingBg={removingBg}
      />
    </div>
  );
}
