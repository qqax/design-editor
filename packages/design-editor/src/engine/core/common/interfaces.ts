// @ts-ignore
import { Point } from 'fabric';

import type {
  Canvas as FabricCanvasClass,
  TPointerEventInfo,
  FabricObject,
  SerializedShadowOptions
} from 'fabric';

import type { EditorConfig } from '../../types';
import type { Editor } from '../editor';

export type Direction = 'top' | 'left';
export type Size = 'width' | 'height';
export type ScaleType = 'fit' | 'fill';

export interface FabricWheelEvent extends TPointerEventInfo {}

export interface Dimension {
  width: number;
  height: number;
}

export interface ControllerOptions {
  canvas: FabricCanvas;
  config: EditorConfig;
  editor: Editor;
  state: EditorState;
}

export interface CanvasOptions {
  width: number;
  height: number;
}

export interface FabricCanvasOption {
  wrapperEl: HTMLElement;
}

export type FabricCanvas<T extends FabricCanvasClass = FabricCanvasClass> = T &
    FabricCanvasOption;

export interface Template {
  id: string;
  name: string;
  preview: string;
  background: FabricObject | SerializedShadowOptions | string | null; // Фон может быть объектом, цветом или градиентом
  frame: {
    width: number;
    height: number;
  };
  objects: Record<string, unknown>[]; // Сериализованные объекты Fabric обычно хранятся как JSON-объекты
  metadata: {
    animated: boolean;
  };
}

export interface GradientOptions {
  angle: number;
  colors: string[];
}

export interface ShadowOptions extends Partial<SerializedShadowOptions> {
  enabled: boolean;
}

export interface EditorState {
  frame: FabricObject | { width: number; height: number } | null;
  activeObject: FabricObject | null;
  objects: FabricObject[];
  zoomRatio: number;
  contextMenuRequest: { clientX: number; clientY: number; target?: FabricObject } | null;
  editor: Editor | null;
  setFrame: (o: FabricObject | { width: number; height: number } | null) => void;
  setActiveObject: (o: FabricObject | null) => void;
  setObjects: (o: FabricObject[]) => void;
  setZoomRatio: (ratio: number | ((prev: number) => number)) => void;
  setContextMenuRequest: (request: { clientX: number; clientY: number; target?: FabricObject } | null) => void;
  setEditor: (editor: Editor | null) => void;
}
