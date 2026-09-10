'use client';

import React, {memo, useContext, useEffect, useRef} from 'react';

import {Editor, Context} from '../engine';

const WORKSPACE_BG = 'var(--de-color-bg)';

// ─── FrozenCanvas ─────────────────────────────────────────────────────────────
const FrozenCanvas = memo(
  function FrozenCanvas({
                          config,
                          contextRef,
                          canvasBg,
                        }: {
    config: Record<string, any>;
    contextRef: React.RefObject<any>;
    canvasBg: string;
  }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const initTimer = window.setTimeout(() => {
        if (!container || !contextRef.current) {
          return;
        }

        const w = container.clientWidth || 800;
        const h = container.clientHeight || 600;

        let editor: InstanceType<typeof Editor> | null = null;

        try {
          editor = new Editor({
            id: 'layerhub_io_canvas',
            config: {
              ...config,
              size: {
                width: w,
                height: h,
              },
            },
            state: contextRef.current,
          });
        } catch (err) {
          console.error(
            '[FrozenCanvas] Editor init failed:',
            err,
          );

          return;
        }

        try {
          if (
            canvasBg &&
            canvasBg !== '#ffffff'
          ) {
            editor.frame?.setBackgroundColor?.(
              canvasBg,
            );
          }
        } catch {
          /* ignore */
        }

        const resizeObserver =
          new ResizeObserver(() => {
            if (!container || !editor) {
              return;
            }

            const nw =
              container.clientWidth || 800;

            const nh =
              container.clientHeight || 600;

            try {
              editor.canvas.resize({
                width: nw,
                height: nh,
              });
            } catch (error) {
              console.error(
                '[FrozenCanvas] Resize failed:',
                error,
              );
            }
          });

        resizeObserver.observe(container);

        (container as any).__layerhubEditor =
          editor;

        (container as any).__layerhubObserver =
          resizeObserver;
      }, 0);

      return () => {
        clearTimeout(initTimer);

        if (!container) {
          return;
        }

        const observer =
          (container as any)
            .__layerhubObserver as
            | ResizeObserver
            | undefined;

        observer?.disconnect();

        const editor =
          (container as any)
            .__layerhubEditor as
            | InstanceType<typeof Editor>
            | undefined;

        try {
          editor?.destroy?.();
        } catch {
          /* ignore */
        }

        delete (
          container as any
        ).__layerhubEditor;

        delete (
          container as any
        ).__layerhubObserver;
      };
    }, []);

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <canvas id="layerhub_io_canvas" />
        </div>
      </div>
    );
  },
  () => true,
);

// ─── CanvasContextBridge ──────────────────────────────────────────────────────
const CANVAS_CONFIG = {
  clipToFrame: true,
  scrollLimit: 2500,
  frameMargin: 80,
  background: 'transparent',
  size: { width: 1920, height: 1080 },
  controlsPosition: { rotation: 'TOP' as const },
  guidelines: true,
  shortcuts: true,
};

function CanvasContextBridge({ canvasBg }: { canvasBg: string }) {
  const context = useContext(Context);
  const contextRef = useRef<any>(null);
  if (contextRef.current === null) contextRef.current = context;
  return (
    <FrozenCanvas
      canvasBg={canvasBg}
      config={CANVAS_CONFIG}
      contextRef={contextRef}
    />
  );
}

// ─── CanvasArea ───────────────────────────────────────────────────────────────
export const CanvasArea = memo(function CanvasArea({
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  canvasBg,
  workspaceBg,
}: {
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  canvasBg: string;
  workspaceBg?: string;
}) {
  return (
    <div
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: workspaceBg ?? WORKSPACE_BG,
        backgroundImage:
          'radial-gradient(color-mix(in srgb, var(--de-color-text) 8%, transparent) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        overflow: 'hidden',
        outline: dragOver ? '3px solid var(--de-color-primary)' : 'none',
        outlineOffset: -3,
        transition: 'outline 0.15s',
      }}
    >
      <CanvasContextBridge canvasBg={canvasBg} />

      {dragOver ? (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
            background:
              'color-mix(in srgb, var(--de-color-primary) 88%, transparent)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            padding: '8px 20px',
            borderRadius: 10,
            boxShadow:
              '0 4px 24px color-mix(in srgb, var(--de-color-primary) 50%, transparent)',
          }}
        >
          Drop to add to canvas
        </div>
      ) : null}
    </div>
  );
});
