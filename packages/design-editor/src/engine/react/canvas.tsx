import { useContext, useEffect, useRef } from 'react';

import ResizeObserver from 'resize-observer-polyfill';

import { Editor } from '../core';
import { Context } from './context';

import type { EditorConfig } from '../types';

interface Props {
  config?: Partial<EditorConfig>;
}

export const Canvas = (props: Props) => {
  const context = useContext(Context);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const { clientWidth, clientHeight } = container;

    const { config } = props;

    const editor = new Editor({
      id: 'layerhub_io_canvas',
      config: {
        ...config,
        size: {
          width: clientWidth,
          height: clientHeight,
        },
      },
      state: context,
    });

    let resizeFrame: number | null = null;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);

      if (width <= 0 || height <= 0) {
        return;
      }

      if (resizeFrame !== null) {
        cancelAnimationFrame(resizeFrame);
      }

      resizeFrame = requestAnimationFrame(() => {
        editor.canvas.resize({
          width,
          height,
        });
      });
    });

    resizeObserver.observe(container);

    return () => {
      if (resizeFrame !== null) {
        cancelAnimationFrame(resizeFrame);
      }

      resizeObserver.disconnect();
      editor.destroy();
    };
  }, [context, props]);

  return (
    <div
      ref={containerRef}
      id="layerhub_io_canvas_container"
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <canvas id="layerhub_io_canvas" />
      </div>
    </div>
  );
};
