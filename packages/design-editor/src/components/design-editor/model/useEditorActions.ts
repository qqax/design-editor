import { useCallback, useState } from 'react';

import { collectFonts, exportScene, StaticImage } from '../../../engine';
import { generateId } from '../../../engine/core/utils/id';
import { clearAutosave } from '../../../hooks/useAutoSave';
import { useMessages } from '../../../messages';
import { exportFileName } from '../../toolbars/model';
import { downloadBlob } from '../lib/download';
import { rescaleImageGeometry } from '../lib/rescaleImageGeometry';
import { svgFontCss } from '../lib/svgFonts';
import { buildTextDesignLayers } from '../lib/textDesignLayers';

import type { FabricObject } from 'fabric';

import type {
  CanvasBackground,
  Editor,
  ExportFormat,
  ExportOptions,
  IScene,
} from '../../../engine';
import type {
  BackgroundRemovalProvider,
  FontProvider,
  PersistenceProvider,
} from '../../../providers';
import type { TextPreset } from '../../panels';
import type { DesignResource } from '../../panels/common/provider';
import type { toastApi } from '../../primitives/Toast';
import type { ExportTarget } from '../../toolbars/model';

const blobToDataUrl = async (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error('Failed to read image'));
    reader.readAsDataURL(blob);
  });

const toScreenRect = (editor: Editor, object: FabricObject) => {
  const { left, top, width, height } = object.getBoundingRect();
  const [zoomX, , , zoomY, panX, panY] = editor.canvas.canvas.viewportTransform;
  return {
    left: left * zoomX + panX,
    top: top * zoomY + panY,
    width: width * zoomX,
    height: height * zoomY,
  };
};

export function useEditorActions(
  editor: Editor | null,
  activeObj: FabricObject | null,
  sceneKey: string | undefined,
  backgroundRemovalProvider: BackgroundRemovalProvider,
  exportToLibrary: (
    blob: Blob,
    format: ExportFormat,
    scene: IScene
  ) => Promise<boolean>,
  message: typeof toastApi,
  setCanvasBg: (bg: CanvasBackground) => void,
  setHasUnsavedChanges: (val: boolean) => void,
  persistenceProvider: PersistenceProvider,
  fontProvider: FontProvider
) {
  const m = useMessages();
  const [removingBg, setRemovingBg] = useState(false);
  const [shimmerRect, setShimmerRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const handleAddMedia = useCallback(
    async (url: string, position?: { top: number; left: number }) => {
      if (!editor) return;
      try {
        const type = /\.(mp4|webm)$/i.test(url) ? 'StaticVideo' : 'StaticImage';
        await editor.objects.add({
          type,
          src: url,
          top: position?.top ?? 100,
          left: position?.left ?? 100,
          metadata: { source: 'qqax' },
        });
      } catch {
        message.error(m.gallery.addFailed);
      }
    },
    [editor, message, m]
  );

  const addImageToCanvas = useCallback(
    (url: string, top = 100, left = 100) => {
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
        await editor.objects.add({
          type: 'StaticImage',
          src: url,
          top,
          left,
          scaleX: scale,
          scaleY: scale,
        });
      };
      img.onerror = () => {
        message.error(m.gallery.loadImageFailed);
      };
    },
    [editor, message, m]
  );

  const handleAddText = useCallback(
    async ({ text, fontSize, fontWeight }: TextPreset) => {
      if (!editor) return;
      try {
        await editor.objects.add({
          type: 'StaticText',
          text,
          fontSize,
          fontWeight: String(fontWeight),
          fill: '#1a1a1a',
          top: 100,
          left: 100,
        });
      } catch {
        message.error(m.textDesigns.addTextFailed);
      }
    },
    [editor, message, m]
  );

  const handleApplyTextDesign = useCallback(
    (design: DesignResource) => {
      if (!editor) return;
      const { width = 1080, height = 1080 } = editor.frame.options;
      const layers = buildTextDesignLayers(
        design,
        { width, height },
        generateId,
        m.layers.names.backdrop
      );

      void layers
        .reduce<Promise<unknown>>(
          async (previous, layer) =>
            previous.then(async () =>
              editor.objects.add({ ...layer, skipCentering: true })
            ),
          Promise.resolve()
        )
        .then(() => {
          editor.objects.selectMany(
            layers.flatMap((layer) => (layer.id ? [layer.id] : []))
          );
        })
        .catch(() => {
          message.error(m.textDesigns.addFailed);
        });
    },
    [editor, message, m]
  );

  const handleApplyTemplate = useCallback(
    (template: DesignResource) => {
      if (!editor) return;
      void editor.scene
        .importFromJSON(template.scene)
        .catch(() => {
          message.error(m.templates.applyFailed);
        })
        .then(() => {
          if (template.canvasBg) {
            setCanvasBg(template.canvasBg);
            try {
              editor.frame.setBackground(template.canvasBg);
            } catch {
              /* empty */
            }
          }
          void clearAutosave(persistenceProvider, sceneKey);
          setHasUnsavedChanges(false);
          setTimeout(() => {
            editor.history.initialize();
          }, 50);
        });
    },
    [
      editor,
      sceneKey,
      setCanvasBg,
      setHasUnsavedChanges,
      message,
      persistenceProvider,
      m,
    ]
  );

  const handleRemoveBg = useCallback(async () => {
    if (!editor || !(activeObj instanceof StaticImage)) return;
    const image = activeObj;
    const src = image.getSrc();
    if (!src) return;

    setShimmerRect(toScreenRect(editor, image));
    setRemovingBg(true);
    message.info(m.image.removingBackground);
    try {
      const blob = await backgroundRemovalProvider.remove(src);
      const dataUrl = await blobToDataUrl(blob);
      const originalSize = image.getOriginalSize();
      const { width, height, cropX, cropY, scaleX, scaleY } = image;
      await image.setSrc(dataUrl);
      image.set(
        rescaleImageGeometry(
          { width, height, cropX, cropY, scaleX, scaleY },
          originalSize,
          image.getOriginalSize()
        )
      );
      image.setCoords();
      editor.canvas.requestRenderAll();
      editor.history.save();
      message.success(m.image.backgroundRemoved);
    } catch (err) {
      message.error(
        m.image.removeFailed(
          err instanceof Error ? err.message : m.image.unknownError
        )
      );
    } finally {
      setRemovingBg(false);
      setShimmerRect(null);
    }
  }, [editor, activeObj, backgroundRemovalProvider, message, m]);

  const handleExport = useCallback(
    async (options: ExportOptions, target: ExportTarget): Promise<boolean> => {
      if (!editor) return false;
      try {
        const scene = editor.scene.exportToJSON();
        const svgCss =
          options.format === 'svg'
            ? svgFontCss(
                collectFonts(scene).map((ref) => ref.family),
                await fontProvider.list().catch(() => [])
              )
            : undefined;
        const blob = await exportScene(editor.renderer, scene, {
          ...options,
          ...(svgCss && { svgCss }),
        });
        if (target === 'download') {
          downloadBlob(blob, exportFileName(scene.name, options.format));
          return true;
        }
        if (!(await exportToLibrary(blob, options.format, scene))) return false;
        setHasUnsavedChanges(false);
        void clearAutosave(persistenceProvider, sceneKey);
        return true;
      } catch {
        message.error(m.export.failed);
        return false;
      }
    },
    [
      editor,
      exportToLibrary,
      setHasUnsavedChanges,
      sceneKey,
      message,
      persistenceProvider,
      fontProvider,
      m,
    ]
  );

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
