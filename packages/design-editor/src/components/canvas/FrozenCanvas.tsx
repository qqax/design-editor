import React, { memo, useEffect, useRef } from 'react';

import { CANVAS_ID } from './constants';
import { Editor } from '../../engine';

import type { EditorConfig } from '../../engine';

interface FabricContext2D {
  fillStyle: string;
  fillRect: (x: number, y: number, w: number, h: number) => void;
}

export const FrozenCanvas = memo(
  ({
    config,
    contextRef,
    canvasBg,
  }: {
    config: Partial<EditorConfig>;
    contextRef: React.RefObject<any>;
    canvasBg: string;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<InstanceType<typeof Editor> | null>(null);

    const applyEditorSettings = (
      editor: InstanceType<typeof Editor>,
      showGrid?: boolean,
      snapGrid?: boolean
    ) => {
      const fabricCanvas = editor.canvas.canvas;
      const w = containerRef.current?.clientWidth || 800;
      const h = containerRef.current?.clientHeight || 600;

      // Настройка сетки
      if (showGrid || snapGrid) {
        const gridSize = 24;
        const gridColor = 'rgba(0, 0, 0, 0.05)';

        fabricCanvas.backgroundColor = {
          source: (ctx: FabricContext2D) => {
            ctx.fillStyle = gridColor;
            const canvasW = fabricCanvas.width ?? w;
            const canvasH = fabricCanvas.height ?? h;

            for (let x = 0; x < canvasW; x += gridSize) {
              for (let y = 0; y < canvasH; y += gridSize) {
                ctx.fillRect(x, y, 1, 1);
              }
            }
          },
          top: 0,
          left: 0,
        } as any;
      } else {
        fabricCanvas.backgroundColor = '';
      }

      if (snapGrid) {
        Object.assign(fabricCanvas, {
          snapThreshold: 10,
          snapAngle: 45,
        });
      } else {
        Object.assign(fabricCanvas, {
          snapThreshold: undefined,
          snapAngle: undefined,
        });
      }

      editor.canvas.requestRenderAll();
    };

    // Эффект 1: Инициализация и уничтожение редактора
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const initTimer = window.setTimeout(() => {
        if (!container || !contextRef.current) return;

        const w = container.clientWidth || 800;
        const h = container.clientHeight || 600;

        let editor: InstanceType<typeof Editor> | null = null;

        try {
          editor = new Editor({
            id: CANVAS_ID,
            config: {
              ...config,
              size: { width: w, height: h },
            },
            state: contextRef.current,
          });
        } catch {
          return;
        }

        try {
          if (canvasBg && canvasBg !== '#ffffff') {
            editor.frame?.setBackgroundColor?.(canvasBg);
          }
        } catch {
          /* ignore */
        }

        editorRef.current = editor;

        applyEditorSettings(editor, config?.showGrid, config?.snapGrid);

        const resizeObserver = new ResizeObserver(() => {
          if (!container || !editor) return;
          const nw = container.clientWidth || 800;
          const nh = container.clientHeight || 600;

          try {
            editor.canvas.resize({ width: nw, height: nh });
          } catch {
            /* ignore */
          }
        });

        resizeObserver.observe(container);

        (container as any).__layerhubEditor = editor;
        (container as any).__layerhubObserver = resizeObserver;
      }, 0);

      return () => {
        clearTimeout(initTimer);
        if (!container) return;

        const observer = (container as any).__layerhubObserver as
          ResizeObserver | undefined;
        observer?.disconnect();

        const editor = (container as any).__layerhubEditor as
          InstanceType<typeof Editor> | undefined;
        try {
          editor?.destroy?.();
        } catch {
          /* ignore */
        }

        editorRef.current = null; // Не забываем очистить реф
        delete (container as any).__layerhubEditor;
        delete (container as any).__layerhubObserver;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextRef]);

    useEffect(() => {
      if (editorRef.current && canvasBg) {
        try {
          editorRef.current.frame?.setBackgroundColor?.(canvasBg);
          editorRef.current.canvas.requestRenderAll();
        } catch {
          /* ignore */
        }
      }
    }, [canvasBg]);

    useEffect(() => {
      if (editorRef.current) {
        applyEditorSettings(
          editorRef.current,
          config?.showGrid,
          config?.snapGrid
        );
      }
    }, [config?.showGrid, config?.snapGrid]);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          ref={containerRef}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <canvas id={CANVAS_ID} />
        </div>
      </div>
    );
  }
);

FrozenCanvas.displayName = 'FrozenCanvas';
