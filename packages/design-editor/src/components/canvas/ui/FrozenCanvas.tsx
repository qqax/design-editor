import React, { memo, useEffect, useId, useRef } from 'react';

import { Editor } from '../../../engine';
import { applyEditorSettings } from '../lib';
import { CANVAS_ID } from '../model';

import type {
  CanvasBackground,
  EditorConfig,
  IEditorState,
} from '../../../engine';

export const FrozenCanvas = memo(
  ({
    config,
    contextRef,
    canvasBg,
  }: {
    config: Partial<EditorConfig>;
    contextRef: React.RefObject<IEditorState | null>;
    canvasBg: CanvasBackground;
  }) => {
    // Fabric finds the element by id, so two editors on a page need two ids.
    const canvasId = `${CANVAS_ID}_${useId().replace(/[^\w-]/g, '')}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Editor | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let editor: Editor | null = null;
      let observer: ResizeObserver | null = null;

      const initTimer = window.setTimeout(() => {
        if (!contextRef.current) return;

        try {
          editor = new Editor({
            id: canvasId,
            config: {
              ...config,
              size: {
                width: container.clientWidth || 800,
                height: container.clientHeight || 600,
              },
            },
            state: contextRef.current,
          });
        } catch {
          return;
        }
        const created = editor;

        if (canvasBg && canvasBg !== '#ffffff') {
          created.frame.setBackground(canvasBg);
        }

        editorRef.current = created;
        applyEditorSettings(created, config?.snapGrid);

        observer = new ResizeObserver(() => {
          created.canvas.resize({
            width: container.clientWidth || 800,
            height: container.clientHeight || 600,
          });
        });
        observer.observe(container);
      }, 0);

      return () => {
        clearTimeout(initTimer);
        observer?.disconnect();
        try {
          editor?.destroy();
        } catch {
          /* already torn down */
        }
        editorRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextRef]);

    useEffect(() => {
      if (editorRef.current && canvasBg) {
        try {
          editorRef.current.frame.setBackground(canvasBg);
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
          <canvas id={canvasId} />
        </div>
      </div>
    );
  }
);

FrozenCanvas.displayName = 'FrozenCanvas';
