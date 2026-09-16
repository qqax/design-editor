import React, { memo } from 'react';

import { CanvasContextBridge } from './CanvasContextBridge';

import type { EditorConfig } from '../../engine';

const WORKSPACE_BG = 'var(--de-color-bg)';

export const CanvasArea = memo(
  ({
    dragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    canvasBg,
    workspaceBg,
    settings,
  }: {
    dragOver: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    canvasBg: string;
    workspaceBg?: string;
    settings: Partial<EditorConfig>;
  }) => {
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
        <CanvasContextBridge canvasBg={canvasBg} settings={settings} />

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
  }
);

CanvasArea.displayName = 'CanvasArea';
