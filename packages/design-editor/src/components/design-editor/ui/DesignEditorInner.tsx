import React, { useEffect, useRef, useState } from 'react';

import { DevelopmentBadge } from './DevelopmentBadge';
import { EditorSidebar } from './EditorSidebar';
import { useActiveObject, useEditor, useZoomRatio } from '../../../engine';
import {
  clearAutosave,
  loadAutosave,
  useAutoSave,
} from '../../../hooks/useAutoSave';
import { useCanvasSize } from '../../../hooks/useCanvasSize';
import { useStudioExport } from '../../../hooks/useStudioExport';
import { useToast } from '../../../hooks/useToast';
import { CanvasArea } from '../../Canvas';
import { useEditorContext } from '../../EditorContext';
import { IconRail } from '../../icon-reail';
import { LayerPanel } from '../../layers';
import { ObjectPropertiesBar } from '../../object-properties';
import { Toolbar } from '../../toolbars';
import { setStorageSafe, storageSafe } from '../lib';
import { useCanvasDrop, useCanvasPanning, useEditorActions } from '../model';

import type { FabricImage } from 'fabric';

import type { TextDesignProvider } from '../../../providers';
import type { PanelKey } from '../../icon-reail';
import type {
  LibraryPanelRenderProp,
  TemplatesPanelRenderProp,
} from '../model';

const WORKSPACE_BG = 'var(--de-color-bg)';

interface Settings {
  showGrid: boolean;
  snapGrid: boolean;
  railSide: 'left' | 'right';
}

export function DesignEditorInner({
  onBack,
  initialScene,
  className,
  templatesPanel,
  libraryPanel,
  title,
  textDesignProvider,
}: {
  onBack?: () => void;
  initialScene?: any;
  className?: string;
  templatesPanel?: TemplatesPanelRenderProp;
  libraryPanel?: LibraryPanelRenderProp;
  title?: React.ReactNode;
  textDesignProvider: TextDesignProvider;
}) {
  const editor = useEditor();
  const activeObj = useActiveObject<FabricImage>();
  const zoomRatio = useZoomRatio<number>();
  const message = useToast();
  const { exportToLibrary, exporting } = useStudioExport();
  const { backgroundRemovalProvider, sceneKey, templateProvider } =
    useEditorContext();

  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [canvasBg, setCanvasBg] = useState<string>(
    () =>
      (initialScene?.canvasBg ||
        storageSafe<string>('studio_canvasBg', '#ffffff')) as string
  );

  const [workspaceBg, setWorkspaceBg] = useState<string>(
    () =>
      (initialScene?.workspaceBg ||
        storageSafe<string>('studio_workspaceBg', '#f5f5f5')) as string
  );

  const [settings, setSettings] = useState<Settings>(() =>
    storageSafe('studio_settings', {
      showGrid: false,
      snapGrid: false,
      railSide: 'left',
    })
  );

  useEffect(() => {
    setStorageSafe('studio_settings', settings);
  }, [settings]);

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
        (editor as any).frame?.setBackgroundColor?.(canvasBg);
      } catch (e) {
        // console.error(e);
      }
    }
  }, [editor, canvasBg]);

  useEffect(() => {
    if (!editor) return;

    const saved = loadAutosave(sceneKey);
    const processScene = (sceneData: any, bgSrc: any) => {
      void editor.scene
        .importFromJSON(sceneData)
        .catch(() => {})
        .then(() => {
          if (bgSrc?.canvasBg) {
            try {
              (editor as any).frame?.setBackgroundColor?.(bgSrc.canvasBg);
            } catch {
              /* empty */
            }
          }
          setTimeout(() => {
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
    return () => editor.off('history:changed', handleChange);
  }, [editor, initialScene, setHasUnsavedChanges, sceneKey]);

  const zoomPct = Math.round(zoomRatio * 100);
  const {
    size,
    customOpen,
    setCustomOpen,
    customW,
    setCustomW,
    customH,
    setCustomH,
    handleSizeChange,
    handleApplyCustom,
  } = useCanvasSize(editor);

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
          canvasBg={canvasBg}
          customH={customH}
          customOpen={customOpen}
          customW={customW}
          editor={editor}
          exporting={exporting}
          handleApplyCustom={handleApplyCustom}
          handleSizeChange={handleSizeChange}
          hasUnsavedChanges={hasUnsavedChanges}
          layerPanelOpen={layerPanelOpen}
          onBgChange={setCanvasBg}
          onExport={handleExport}
          onSettings={(patch) => setSettings((p) => ({ ...p, ...patch }))}
          onToggleLayers={() => setLayerPanelOpen((p) => !p)}
          onWorkspaceBgChange={setWorkspaceBg}
          setCustomH={setCustomH}
          setCustomOpen={setCustomOpen}
          setCustomW={setCustomW}
          settings={settings}
          size={size}
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
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <IconRail activePanel={activePanel} onTogglePanel={setActivePanel} />

          <EditorSidebar
            activePanel={activePanel}
            addImageToCanvas={addImageToCanvas}
            handleAddMedia={handleAddMedia}
            handleAddText={handleAddText}
            handleApplyTemplate={handleApplyTemplate}
            handleApplyTextDesign={handleApplyTextDesign}
            libraryPanel={libraryPanel}
            onClose={() => setActivePanel(null)}
            setActivePanel={setActivePanel}
            templateProvider={templateProvider}
            templatesPanel={templatesPanel}
            textDesignProvider={textDesignProvider}
          />

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
              workspaceBg={workspaceBg}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
            />

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
