import { useCallback, useState } from 'react';
import { generateId } from '../../../engine/core/utils/id';
import { clearAutosave } from '../../../hooks/useAutoSave';
import type { TextDesign, DesignTemplate } from '../../../providers';

export function useEditorActions(
  editor: any,
  activeObj: any,
  sceneKey: string | undefined,
  backgroundRemovalProvider: any,
  exportToLibrary: any,
  message: any,
  setCanvasBg: (bg: string) => void,
  setWorkspaceBg: (bg: string) => void,
  setHasUnsavedChanges: (val: boolean) => void
) {
  const [removingBg, setRemovingBg] = useState(false);
  const [shimmerRect, setShimmerRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const handleAddMedia = useCallback(async (url: string, position?: { top: number; left: number }) => {
    if (!editor) return;
    try {
      const type = /\.(mp4|webm)$/i.test(url) ? 'StaticVideo' : 'StaticImage';
      await editor.objects.add({
        type,
        src: url,
        top: position?.top ?? 100,
        left: position?.left ?? 100,
        metadata: { source: 'qqax' }
      });
    } catch {
      message.error('Failed to add media');
    }
  }, [editor, message]);

  const addImageToCanvas = useCallback((url: string, top = 100, left = 100) => {
    if (!editor) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = async () => {
      let scale = 1;
      const frame = editor.frame?.frame;
      const maxW = (frame?.width || 1080) * 0.8;
      const maxH = (frame?.height || 1080) * 0.8;
      if (img.width > maxW || img.height > maxH) {
        scale = Math.min(maxW / img.width, maxH / img.height);
      }
      await editor.objects.add({ type: 'StaticImage', src: url, top, left, scaleX: scale, scaleY: scale });
    };
    img.onerror = () => message.error('Failed to load image.');
  }, [editor, message]);

  const handleAddText = useCallback(async (text: string, fontSize: number) => {
    if (!editor) return;
    try {
      await editor.objects.add({ type: 'StaticText', text, fontSize, fill: '#1a1a1a', top: 100, left: 100 });
    } catch {
      message.error('Failed to add text');
    }
  }, [editor, message]);

  const handleApplyTextDesign = useCallback((design: TextDesign) => {
    if (!editor) return;
    const frameOpts = editor.frame?.options;
    const dx = ((frameOpts?.width ?? 1080) - design.scene.frame.width) / 2;
    const dy = ((frameOpts?.height ?? 1080) - design.scene.frame.height) / 2;

    const textLayers = design.scene.layers.filter((l: any) => new Set(['StaticText', 'DynamicText']).has(l.type));
    const layersToAdd = textLayers.length === 1 && design.scene.layers.length === 1 ? textLayers : design.scene.layers;

    for (const layer of layersToAdd) {
      editor.objects.add({
        ...layer,
        id: generateId(),
        left: ((layer.left as number) ?? 0) + dx,
        top: ((layer.top as number) ?? 0) + dy,
        skipCentering: true
      });
    }
  }, [editor]);

  const handleApplyTemplate = useCallback((template: DesignTemplate) => {
    if (!editor) return;
    editor.scene.importFromJSON(template.scene).catch(() => message.error('Failed to apply template')).then(() => {
      if (template.canvasBg) {
        setCanvasBg(template.canvasBg);
        try { editor.frame?.setBackgroundColor?.(template.canvasBg); } catch {}
      }
      if (template.workspaceBg) setWorkspaceBg(template.workspaceBg);
      clearAutosave(sceneKey);
      setHasUnsavedChanges(false);
      setTimeout(() => editor.history.initialize(), 50);
    });
  }, [editor, sceneKey, setCanvasBg, setWorkspaceBg, setHasUnsavedChanges, message]);

  const handleRemoveBg = useCallback(async () => {
    const src = activeObj?.getSrc ? activeObj.getSrc() : activeObj?.src;
    if (!editor || !activeObj || activeObj.type !== 'StaticImage' || !src) return;

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
        await activeObj.setSrc(reader.result as string);
        editor.canvas.requestRenderAll();
        editor.history.save();
        setRemovingBg(false);
        setShimmerRect(null);
      };
      reader.readAsDataURL(blob);
      message.success('Background removed successfully!');
    } catch (err: any) {
      message.error(`Failed: ${err.message || 'Unknown error'}`);
      setRemovingBg(false);
      setShimmerRect(null);
    }
  }, [editor, activeObj, backgroundRemovalProvider, message]);

  const handleExport = useCallback(async () => {
    if (!editor) return;
    try {
      const scene = editor.scene.exportToJSON();
      const dataUrl = await editor.renderer.toDataURL(scene, { format: 'png', quality: 1, multiplier: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      if (await exportToLibrary(blob, `design-${Date.now()}.png`, scene)) {
        setHasUnsavedChanges(false);
        clearAutosave(sceneKey);
      }
    } catch {
      message.error('Failed to export');
    }
  }, [editor, exportToLibrary, setHasUnsavedChanges, sceneKey, message]);

  return {
    removingBg,
    shimmerRect,
    handleAddMedia,
    addImageToCanvas,
    handleAddText,
    handleApplyTextDesign,
    handleApplyTemplate,
    handleRemoveBg,
    handleExport,
  };
}
