import React, {useCallback, useEffect, useRef, useState} from 'react';

import {CanvasArea} from '../../Canvas';

import {ShapesPanel} from '../../panels/ShapesPanel'
import {StickersPanel} from '../../panels/StickersPanel'
import {TextPanel} from '../../panels/text/TextPanel'
import {UploadPanel} from '../../panels/UploadPanel'
import {ElementsPanel} from '../../panels/ElementsPanel'

import {useStudioExport} from '../../../hooks/useStudioExport'
import {useCanvasSize} from '../../../hooks/useCanvasSize'
import {clearAutosave, loadAutosave, useAutoSave} from '../../../hooks/useAutoSave'

import {useEditorContext} from '../../EditorContext'
import type {PanelKey} from '../../IconRail';
import {IconRail} from '../../IconRail'
import {LayerPanel} from '../../layers'
import {ObjectPropertiesBar} from '../../ObjectPropertiesBar'
import {useActiveObject, useEditor, useZoomRatio,} from '../../../engine';
import {Toolbar} from '../../Toolbar';
import {useToast} from '../../../hooks/useToast';
import {generateId} from '../../../engine/core/utils/id';
import {TemplatesPanel} from '../../panels/templates/TemplatesPanel'
import type {DesignTemplate, TextDesign, TextDesignProvider} from '../../../providers';
import {FabricImage} from "fabric";
import {getStorageSafe} from "../lib";
import type {LibraryPanelRenderProp, TemplatesPanelRenderProp} from "../model";

const WORKSPACE_BG = 'var(--color-bg)';

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
  const {exportToLibrary, exporting} = useStudioExport();
  const message = useToast();
  const {backgroundRemovalProvider, sceneKey, templateProvider} =
    useEditorContext();

  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);

  const [removingBg, setRemovingBg] = useState(false);
  const [shimmerRect, setShimmerRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Canvas pan state (Space + drag) ──────────────────────────────────
  const [spaceDown, setSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{
    startX: number;
    startY: number;
    vpt: number[];
  } | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !e.repeat &&
        (e.target as HTMLElement)?.tagName !== 'INPUT' &&
        (e.target as HTMLElement)?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setSpaceDown(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpaceDown(false);
        panRef.current = null;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!spaceDown || !editor) return;
      e.preventDefault();
      const fabricCanvas = (editor as any).canvas?.canvas;
      if (!fabricCanvas) return;
      const vpt = fabricCanvas.viewportTransform
        ? [...fabricCanvas.viewportTransform]
        : [1, 0, 0, 1, 0, 0];
      panRef.current = {startX: e.clientX, startY: e.clientY, vpt};
      setIsPanning(true);
    },
    [spaceDown, editor]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!panRef.current || !editor) return;
      const fabricCanvas = (editor as any).canvas?.canvas;
      if (!fabricCanvas) return;
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      const vpt = [...panRef.current.vpt];
      vpt[4] += dx;
      vpt[5] += dy;
      fabricCanvas.setViewportTransform(vpt);
      fabricCanvas.requestRenderAll();
    },
    [editor]
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (panRef.current) {
      panRef.current = null;
      setIsPanning(false);
    }
  }, []);

  const [canvasBg, setCanvasBg] = useState<string>(() => {
    return (
      initialScene?.canvasBg || getStorageSafe('studio_canvasBg', '#ffffff')
    );
  });
  const [workspaceBg, setWorkspaceBg] = useState<string>(() => {
    return (
      initialScene?.workspaceBg ||
      getStorageSafe('studio_workspaceBg', '#f5f5f5')
    );
  });

  useEffect(() => {
    if (editor && canvasBg) {
      try {
        (editor as any).frame?.setBackgroundColor?.(canvasBg);
      } catch (e) {
        console.error('Error setting bg:', e);
      }
    }
  }, [editor, canvasBg]);

  const {hasUnsavedChanges, setHasUnsavedChanges} = useAutoSave(
    editor,
    canvasBg,
    workspaceBg,
    sceneKey
  );

  const handleBack = useCallback(() => {
    clearAutosave(sceneKey);
    if (onBack) onBack();
  }, [onBack, sceneKey]);

  interface Settings {
    showGrid: boolean;
    snapGrid: boolean;
    railSide: 'left' | 'right';
  }

  const [settings, setSettings] = useState<Settings>(() => {
    return getStorageSafe('studio_settings', {
      showGrid: false,
      snapGrid: false,
      railSide: 'left',
    });
  });

  const handleSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev: Settings) => {
      const next = {...prev, ...patch};
      localStorage.setItem('studio_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const restoreShapes = useCallback(() => {
    if (!editor) return;
    const objs = (editor.scene.exportToJSON() as any)?.layers || [];
    objs.forEach((o: any) => {
      if (o.type === 'polygon' && o.metadata?.shapeType) {
        const polyObj = (editor.canvas as any)?.canvas
          ?.getObjects?.()
          .find((obj: any) => obj.id === o.id);
        if (polyObj) {
          polyObj.set({shapeType: o.metadata.shapeType});
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const saved = loadAutosave(sceneKey);
    if (saved && Object.keys(saved).length > 0) {
      if (saved.scene) {
        editor.scene
          .importFromJSON(saved.scene)
          .catch(() => {
          })
          .then(() => {
            restoreShapes();
            if (saved.canvasBg) {
              try {
                (editor as any).frame?.setBackgroundColor?.(saved.canvasBg);
              } catch {
              }
            }
            setTimeout(() => {
              editor.history.reset();
              editor.history.initialize();
              setHasUnsavedChanges(false);
            }, 50);
          });
      }
      if (saved.canvasBg) setCanvasBg(saved.canvasBg);
      if (saved.workspaceBg) setWorkspaceBg(saved.workspaceBg);
    } else if (initialScene) {
      const scene = initialScene.scene || initialScene;
      editor.scene
        .importFromJSON(scene)
        .catch(() => {
        })
        .then(() => {
          restoreShapes();
          if (initialScene.canvasBg) {
            try {
              (editor as any).frame?.setBackgroundColor?.(
                initialScene.canvasBg
              );
            } catch {
            }
          }
          setTimeout(() => {
            editor.history.reset();
            editor.history.initialize();
            setHasUnsavedChanges(false);
          }, 50);
        });
      if (initialScene.canvasBg) setCanvasBg(initialScene.canvasBg);
      if (initialScene.workspaceBg) setWorkspaceBg(initialScene.workspaceBg);
    }

    const handleChange = () => setHasUnsavedChanges(true);
    editor.on('history:changed', handleChange);
    return () => editor.off('history:changed', handleChange);
  }, [editor, initialScene, restoreShapes, setHasUnsavedChanges, sceneKey]);

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

  const handleAddMedia = useCallback(
    async (url: string, position?: { top: number; left: number }) => {
      if (!editor) return;
      try {
        const type = /\.(mp4|webm)$/i.exec(url) ? 'StaticVideo' : 'StaticImage';
        const options = {
          type,
          src: url,
          top: position?.top ?? 100,
          left: position?.left ?? 100,
          metadata: {source: 'qqax'},
        };
        await editor?.objects.add(options);
      } catch (err: any) {
        console.error('[handleAddMedia] Error:', err);
        message.error('Failed to add media');
      }
    },
    [editor, message]
  );

  const addImageToCanvas = useCallback(
    (url: string, top = 100, left = 100) => {
      if (!editor) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = async () => {
        let scale = 1;
        const frame = (editor as any)?.frame?.frame;
        const maxW = ((frame?.width as number) || 1080) * 0.8;
        const maxH = ((frame?.height as number) || 1080) * 0.8;
        if (img.width > maxW || img.height > maxH) {
          const scaleW = maxW / img.width;
          const scaleH = maxH / img.height;
          scale = Math.min(scaleW, scaleH);
        }

        await editor?.objects.add({
          type: 'StaticImage',
          src: url,
          top,
          left,
          scaleX: scale,
          scaleY: scale,
        });
      };
      img.onerror = () => message.error('Failed to load image.');
    },
    [editor, message]
  );

  const handleAddText = useCallback(
    async (text: string, fontSize: number) => {
      if (!editor) return;
      try {
        await editor?.objects.add({
          type: 'StaticText',
          text,
          fontSize,
          fill: '#1a1a1a',
          top: 100,
          left: 100,
        });
      } catch {
        message.error('Failed to add text');
      }
    },
    [editor, message]
  );

  const handleApplyTextDesign = useCallback(
    (design: TextDesign) => {
      if (!editor) return;
      const frameOpts = (editor as any).frame?.options;
      const frameW: number = frameOpts?.width ?? 1080;
      const frameH: number = frameOpts?.height ?? 1080;
      const dx = (frameW - design.scene.frame.width) / 2;
      const dy = (frameH - design.scene.frame.height) / 2;

      // Find the primary text layer(s) from the design
      const textTypes = new Set(['StaticText', 'DynamicText']);
      const textLayers = design.scene.layers.filter((l: any) =>
        textTypes.has(l.type)
      );
      const allLayers = design.scene.layers;

      // If there is exactly one text layer and no other visual layers, add it as
      // a single editable text object so the user can immediately double-click to edit.
      // If it's a multi-element design, keep all layers (grouped look).
      const layersToAdd =
        textLayers.length === 1 && allLayers.length === 1
          ? textLayers
          : allLayers;

      for (const layer of layersToAdd) {
        editor.objects.add({
          ...layer,
          id: generateId(),
          left: ((layer.left as number) ?? 0) + dx,
          top: ((layer.top as number) ?? 0) + dy,
        });
      }
    },
    [editor]
  );

  const handleApplyTemplate = useCallback(
    (template: DesignTemplate) => {
      if (!editor) return;
      const proceed = () => {
        editor.scene
          .importFromJSON(template.scene)
          .catch(() => message.error('Failed to apply template'))
          .then(() => {
            if (template.canvasBg) {
              setCanvasBg(template.canvasBg);
              try {
                (editor as any).frame?.setBackgroundColor?.(template.canvasBg);
              } catch {
              }
            }
            if (template.workspaceBg) setWorkspaceBg(template.workspaceBg);
            clearAutosave(sceneKey);
            setHasUnsavedChanges(false);
            setTimeout(() => editor.history.initialize(), 50);
          });
      };
      const hasHistoryUndo = (editor?.history?.status?.undos?.length ?? 0) > 0;
      if (hasUnsavedChanges && hasHistoryUndo) {
        const ok = window.confirm(
          'Replace current design? Unsaved changes will be lost.'
        );
        if (!ok) return;
      }
      proceed();
    },
    [editor, hasUnsavedChanges, sceneKey, setHasUnsavedChanges, message]
  );

  const handleRemoveBg = useCallback(async () => {
    const src = activeObj?.getSrc
      ? activeObj.getSrc()
      : (activeObj as any)?.src;
    if (!editor || !activeObj || activeObj.type !== 'StaticImage' || !src)
      return;

    setShimmerRect({
      top: activeObj.top ?? 0,
      left: activeObj.left ?? 0,
      width: (activeObj.width ?? 100) * (activeObj.scaleX ?? 1),
      height: (activeObj.height ?? 100) * (activeObj.scaleY ?? 1),
    });

    setRemovingBg(true);
    message.info('Removing background...');
    try {
      const blob = await backgroundRemovalProvider.remove(src);
      const reader = new FileReader();
      reader.onload = async () => {
        const b64 = reader.result as string;
        await activeObj.setSrc(b64);
        editor?.canvas.requestRenderAll();
        editor?.history.save();
        setRemovingBg(false);
        setShimmerRect(null);
      };
      reader.onerror = () => {
        setRemovingBg(false);
        setShimmerRect(null);
        message.error('Failed to read image blob');
      };
      reader.readAsDataURL(blob);
      message.success('Background removed successfully!');
    } catch (err: any) {
      console.error('[handleRemoveBg] Error:', err);
      message.error(`Failed: ${err.message || 'Unknown error'}`);
      setRemovingBg(false);
      setShimmerRect(null);
    }
  }, [editor, activeObj, message, backgroundRemovalProvider]);

  const handleExport = useCallback(async () => {
    if (!editor) return;
    try {
      const scene = editor.scene.exportToJSON();
      const dataUrl: string = await (editor as any).renderer.toDataURL(scene, {
        format: 'png',
        quality: 1,
        multiplier: 2,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const success = await exportToLibrary(
        blob,
        `design-${Date.now()}.png`,
        scene
      );
      if (success) {
        setHasUnsavedChanges(false);
        clearAutosave(sceneKey);
      }
    } catch {
      message.error('Failed to export');
    }
  }, [editor, exportToLibrary, message, setHasUnsavedChanges]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!editor) return;

      const shapeSrc = e.dataTransfer.getData('text/x-qqax-shape-src');
      const stickerSrc = e.dataTransfer.getData('text/x-qqax-sticker-src');
      const mediaUrl = e.dataTransfer.getData('text/x-qqax-url');

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let left = e.clientX - rect.left;
      let top = e.clientY - rect.top;

      try {
        const zoom = editor.canvas.canvas.getZoom() || 1;
        const vpt = editor.canvas.canvas.viewportTransform || [
          1, 0, 0, 1, 0, 0,
        ];
        left = (left - vpt[4]) / zoom;
        top = (top - vpt[5]) / zoom;
      } catch {
        /* ignore if canvas not ready */
      }

      if (shapeSrc || stickerSrc) {
        addImageToCanvas(shapeSrc || stickerSrc, top, left);
      } else if (mediaUrl) {
        handleAddMedia(mediaUrl, {top, left});
      }
    },
    [editor, addImageToCanvas, handleAddMedia]
  );

  return (
    <div
      data-de-root
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
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
          onBack={onBack ? handleBack : undefined}
          onBgChange={setCanvasBg}
          onExport={handleExport}
          onSettings={handleSettings}
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
        />

        <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>
          <IconRail activePanel={activePanel} onTogglePanel={setActivePanel}/>

          {activePanel ? (
            <div
              style={{
                width: 320,
                background: 'var(--color-surface, var(--de-color-bg-elevated))',
                borderRight:
                  '1px solid var(--color-border, var(--de-color-border))',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 12px 0 12px',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    color: 'var(--color-text)',
                  }}
                >
                  {activePanel}
                </span>
                <button
                  onClick={() => setActivePanel(null)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--color-border)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontSize: 18,
                    lineHeight: 1,
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                  }}
                >
                  ×
                </button>
              </div>
              <div
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {activePanel === 'templates' &&
                  (templatesPanel ? (
                    typeof templatesPanel === 'function' ? (
                      templatesPanel({onApplyTemplate: handleApplyTemplate})
                    ) : (
                      templatesPanel
                    )
                  ) : (
                    <TemplatesPanel
                      onApplyTemplate={handleApplyTemplate}
                      provider={templateProvider}
                    />
                  ))}
                {activePanel === 'elements' && (
                  <ElementsPanel
                    onAddShape={(src) => addImageToCanvas(src)}
                    onAddSticker={(src) => addImageToCanvas(src)}
                    onApplyTextDesign={handleApplyTextDesign}
                    onSeeAll={(panel) => setActivePanel(panel)}
                    textDesignProvider={textDesignProvider}
                  />
                )}
                {activePanel === 'text' && (
                  <TextPanel
                    onApplyTextDesign={handleApplyTextDesign}
                    provider={textDesignProvider}
                    onAddPlainText={(preset) => {
                      const map = {
                        heading: 72,
                        subheading: 48,
                        body: 28,
                      } as const;
                      handleAddText(preset, map[preset]);
                    }}
                  />
                )}
                {activePanel === 'shapes' && (
                  <ShapesPanel onAddShape={(src) => addImageToCanvas(src)}/>
                )}
                {activePanel === 'stickers' && (
                  <StickersPanel
                    onAddSticker={(url) => addImageToCanvas(url)}
                  />
                )}
                {activePanel === 'upload' &&
                  (libraryPanel ? (
                    typeof libraryPanel === 'function' ? (
                      libraryPanel({onAddMedia: handleAddMedia})
                    ) : (
                      libraryPanel
                    )
                  ) : (
                    <UploadPanel
                      onUploadFile={async (url) => handleAddMedia(url)}
                    />
                  ))}
              </div>
            </div>
          ) : null}

          <div
            ref={canvasWrapRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseLeave={handleCanvasMouseUp}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
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
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  borderRadius: 8,
                }}
              />
            ) : null}

            {activeObj ? (
              <ObjectPropertiesBar
                activeObj={activeObj}
                editor={editor}
                onRemoveBg={handleRemoveBg}
                removingBg={removingBg}
              />
            ) : null}

            {/* Development Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                background: 'rgba(20, 20, 20, 0.65)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                borderRadius: '24px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 50,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#a855f7',
                  boxShadow: '0 0 10px #a855f7',
                }}
              />
              <span
                style={{
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                In Development
              </span>
            </div>
          </div>

          {layerPanelOpen ? (
            <LayerPanel
              editor={editor}
              onClose={() => setLayerPanelOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}