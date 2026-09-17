import * as React from 'react';
import { useMemo } from 'react';

import type { FabricObject } from 'fabric';

import type { Editor, EditorState } from '../../core';

const Context = React.createContext<EditorState>({
  zoomRatio: 1,
  activeObject: null,
  contextMenuRequest: null,
  frame: null,
  objects: [],
  editor: null,
  setActiveObject: () => {},
  setContextMenuRequest: () => {},
  setFrame: () => {},
  setObjects: () => {},
  setZoomRatio: () => {},
  setEditor: () => {},
});

const Provider: any = ({ children }: { children: React.ReactNode }) => {
  const [zoomRatio, setZoomRatio] = React.useState(1);
  const [activeObject, setActiveObject] = React.useState<FabricObject | null>(
    null
  );
  const [frame, setFrame] = React.useState<
    | FabricObject
    | {
        width: number;
        height: number;
      }
    | null
  >(null);
  const [editor, setEditor] = React.useState<Editor | null>(null);
  const [contextMenuRequest, setContextMenuRequest] = React.useState<{
    clientX: number;
    clientY: number;
    target?: FabricObject | undefined;
  } | null>(null);
  const [objects, setObjects] = React.useState<FabricObject[]>([]);

  const cachedValue = useMemo(
    () => ({
      zoomRatio,
      setZoomRatio,
      activeObject,
      setActiveObject,
      frame,
      setFrame,
      contextMenuRequest,
      setContextMenuRequest,
      objects,
      setObjects,
      editor,
      setEditor,
    }),
    [activeObject, contextMenuRequest, editor, frame, objects, zoomRatio]
  );

  return <Context.Provider value={cachedValue}>{children}</Context.Provider>;
};

export { Context, Provider };
