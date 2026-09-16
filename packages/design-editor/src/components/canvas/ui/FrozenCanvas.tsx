import React, { memo, useEffect, useRef } from 'react';

import { Editor } from '../../../engine';
import { applyEditorSettings } from '../lib';
import { CANVAS_ID } from '../model';

import type { EditorConfig } from '../../../engine';

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

        applyEditorSettings(editor, config?.snapGrid);

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

        editorRef.current = null;
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
        applyEditorSettings(editorRef.current, config?.snapGrid);
      }
    }, [canvasBg, config?.showGrid, config?.snapGrid]);

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
