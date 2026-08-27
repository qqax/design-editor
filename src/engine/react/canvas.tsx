import * as React from 'react';

import ResizeObserver from 'resize-observer-polyfill';

import { Editor } from '../core';
import { Context } from './context';

import type { EditorConfig } from '../types';

interface Props {
  config?: Partial<EditorConfig>;
}
export const Canvas = (props: Props) => {
  const context = React.useContext(Context);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current as HTMLDivElement;
    const { clientHeight, clientWidth } = container;
    const editor = new Editor({
      id: 'layerhub_io_canvas',
      config: {
        ...props.config,
        size: {
          width: clientWidth,
          height: clientHeight,
        },
      },
      state: context,
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const { width = clientWidth, height = clientHeight } =
        (entries[0] && entries[0].contentRect) || {};
      editor.canvas.resize({
        width,
        height,
      });
    });
    resizeObserver.observe(container);
    return () => {
      editor.destroy();
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={containerRef}
      id="layerhub_io_canvas_container"
      style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      >
        <canvas id="layerhub_io_canvas" />
      </div>
    </div>
  );
};
