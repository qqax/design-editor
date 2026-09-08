import React, { useEffect, useRef, useState } from 'react';
import { CanvasArea } from '../../Canvas';
import { useStudioExport } from '../../../hooks/useStudioExport';
import { useCanvasSize } from '../../../hooks/useCanvasSize';
import { clearAutosave, loadAutosave, useAutoSave } from '../../../hooks/useAutoSave';
import { useEditorContext } from '../../EditorContext';
import type { PanelKey } from '../../IconRail';
import { IconRail } from '../../IconRail';
import { LayerPanel } from '../../layers';
import { ObjectPropertiesBar } from '../../ObjectPropertiesBar';
import { useActiveObject, useEditor, useZoomRatio } from '../../../engine';
import { Toolbar } from '../../Toolbar';
import { useToast } from '../../../hooks/useToast';
import { FabricImage } from 'fabric';
import { getStorageSafe } from '../lib';
import type { LibraryPanelRenderProp, TemplatesPanelRenderProp } from '../model';
import { useCanvasDrop, useCanvasPanning, useEditorActions } from '../model';
import type { TextDesignProvider } from '../../../providers';
import { EditorSidebar } from './EditorSidebar';
import { DevelopmentBadge } from './DevelopmentBadge';

const WORKSPACE_BG = 'var(--color-bg)';

interface Settings {
  showGrid: boolean;
  snapGrid: boolean;
  railSide: 'left' | 'right';
}

export function DesignEditorInner({
                                    onBack, initialScene, className, templatesPanel, libraryPanel, title, textDesignProvider,
                                  }: {
  onBack?: () => void; initialScene?: any; className?: string;
  templatesPanel?: TemplatesPanelRenderProp; libraryPanel?: LibraryPanelRenderProp;
  title?: React.ReactNode; textDesignProvider: TextDesignProvider;
}) {
  const editor = useEditor();
  const activeObj = useActiveObject<FabricImage>();
  const zoomRatio = useZoomRatio<number>();
  const message = useToast();
  const { exportToLibrary, exporting } = useStudioExport();
  const { backgroundRemovalProvider, sceneKey, templateProvider } = useEditorContext();

  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [canvasBg, setCanvasBg] = useState<string>(() => initialScene?.canvasBg || getStorageSafe('studio_canvasBg', '#ffffff'));
  const [workspaceBg, setWorkspaceBg] = useState<string>(() => initialScene?.workspaceBg || getStorageSafe('studio_workspaceBg', '#f5f5f5'));
  const [settings, setSettings] = useState<Settings>(() => getStorageSafe('studio_settings', { showGrid: false, snapGrid: false, railSide: 'left' }));

  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const { hasUnsavedChanges, setHasUnsavedChanges } = useAutoSave(editor, canvasBg, workspaceBg, sceneKey);

  const {
    removingBg, shimmerRect, handleAddMedia, addImageToCanvas,
    handleAddText, handleApplyTextDesign, handleApplyTemplate, handleRemoveBg, handleExport
  } = useEditorActions(editor, activeObj, sceneKey, backgroundRemovalProvider, exportToLibrary, message, setCanvasBg, setWorkspaceBg, setHasUnsavedChanges);

  const { spaceDown, isPanning, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasPanning(editor);

  const { dragOver, setDragOver, handleDrop } = useCanvasDrop(editor, addImageToCanvas, handleAddMedia);

  useEffect(() => {
    if (editor && canvasBg) {
      try { (editor as any).frame?.setBackgroundColor?.(canvasBg); } catch (e) { console.error(e); }
    }
  }, [editor, canvasBg]);

  useEffect(() => {
    if (!editor) return;

    const saved = loadAutosave(sceneKey);
    const processScene = (sceneData: any, bgSrc: any) => {
      editor.scene.importFromJSON(sceneData).catch(() => {}).then(() => {
        if (bgSrc?.canvasBg) { try { (editor as any).frame?.setBackgroundColor?.(bgSrc.canvasBg); } catch {} }
        setTimeout(() => {
          editor.history.reset();
          editor.history.initialize();
          setHasUnsavedChanges(false);
        }, 50);
      });
    };

    if (saved && Object.keys(saved).length > 0) {
      if (saved.scene) processScene(saved.scene, saved);
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
  const { size, customOpen, setCustomOpen, customW, setCustomW, customH, setCustomH, handleSizeChange, handleApplyCustom } = useCanvasSize(editor);

  return (
    <div
      data-de-root className={className}
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--de-color-bg)', color: 'var(--de-color-fg)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', flexDirection: 'column', background: WORKSPACE_BG }}>
        <Toolbar
          canvasBg={canvasBg} customH={customH} customOpen={customOpen} customW={customW}
          editor={editor} exporting={exporting} handleApplyCustom={handleApplyCustom}
          handleSizeChange={handleSizeChange} hasUnsavedChanges={hasUnsavedChanges}
          layerPanelOpen={layerPanelOpen} onBack={onBack ? () => { clearAutosave(sceneKey); onBack(); } : undefined}
          onBgChange={setCanvasBg} onExport={handleExport} onSettings={(patch) => setSettings(p => ({...p, ...patch}))}
          onToggleLayers={() => setLayerPanelOpen(p => !p)} onWorkspaceBgChange={setWorkspaceBg}
          setCustomH={setCustomH} setCustomOpen={setCustomOpen} setCustomW={setCustomW}
          settings={settings} size={size} title={title} workspaceBg={workspaceBg} zoomPct={zoomPct}
        />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <IconRail activePanel={activePanel} onTogglePanel={setActivePanel} />

          <EditorSidebar
            activePanel={activePanel} onClose={() => setActivePanel(null)}
            templatesPanel={templatesPanel} libraryPanel={libraryPanel}
            templateProvider={templateProvider} textDesignProvider={textDesignProvider}
            handleApplyTemplate={handleApplyTemplate} addImageToCanvas={addImageToCanvas}
            handleApplyTextDesign={handleApplyTextDesign} handleAddText={handleAddText}
            handleAddMedia={handleAddMedia} setActivePanel={setActivePanel}
          />

          <div
            ref={canvasWrapRef}
            onMouseDown={handleMouseDown} onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
            style={{
              flex: 1, position: 'relative', overflow: 'hidden',
              cursor: spaceDown ? (isPanning ? 'grabbing' : 'grab') : 'default',
            }}
          >
            <CanvasArea
              canvasBg={canvasBg} dragOver={dragOver} workspaceBg={workspaceBg}
              onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            />

            {removingBg && shimmerRect && (
              <div
                style={{
                  position: 'absolute', top: shimmerRect.top, left: shimmerRect.left,
                  width: shimmerRect.width, height: shimmerRect.height,
                  pointerEvents: 'none', zIndex: 20, borderRadius: 4, overflow: 'hidden',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            )}

            <DevelopmentBadge />
          </div>

          {layerPanelOpen && (
            <LayerPanel editor={editor} onClose={() => setLayerPanelOpen(false)} />
          )}
        </div>
      </div>

      <ObjectPropertiesBar activeObj={activeObj} editor={editor} onRemoveBg={handleRemoveBg} removingBg={removingBg} />
    </div>
  );
}
