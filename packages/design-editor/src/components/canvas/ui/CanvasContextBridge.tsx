'use client';

import React, { useContext, useRef } from 'react';

import { FrozenCanvas } from './FrozenCanvas';
import { Context } from '../../../engine';

import type { EditorConfig } from '../../../engine';

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

export function CanvasContextBridge({
  canvasBg,
  settings,
}: {
  canvasBg: string;
  settings: Partial<EditorConfig>;
}) {
  const context = useContext(Context);
  const contextRef = useRef<any>(null);
  if (contextRef.current === null) contextRef.current = context;

  return (
    <FrozenCanvas
      canvasBg={canvasBg}
      config={{ ...CANVAS_CONFIG, ...settings }}
      contextRef={contextRef}
    />
  );
}
