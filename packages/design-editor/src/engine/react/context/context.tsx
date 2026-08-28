import * as React from 'react';

import {Editor, EditorState} from '../../core';
import {FabricObject, FabricObjectProps, ObjectEvents, SerializedObjectProps} from "fabric";

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
  const [activeObject, setActiveObject] = React.useState<FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents> | null>(null);
  const [frame, setFrame] = React.useState<FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents> | {
      width: number;
      height: number;
  } | null>(null);
  const [editor, setEditor] = React.useState<Editor | null>(null);
  const [contextMenuRequest, setContextMenuRequest] = React.useState<{
      clientX: number;
      clientY: number;
      target?: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents> | undefined;
  } | null>(null);
  const [objects, setObjects] = React.useState<FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>[]>([]);

  return (
    <Context.Provider
      value={{
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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
