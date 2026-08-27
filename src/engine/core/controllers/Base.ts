import type { Editor } from '..';
import type { EditorConfig } from '../../types';
import type {
  ControllerOptions,
  EditorState,
  FabricCanvas,
} from '../common/interfaces';

class Base {
  protected canvas: FabricCanvas;

  protected config: EditorConfig;

  protected editor: Editor;

  protected state: EditorState;

  constructor({ canvas, config, editor, state }: ControllerOptions) {
    this.canvas = canvas;
    this.config = config;
    this.editor = editor;
    this.state = state;
  }
}

export default Base;
