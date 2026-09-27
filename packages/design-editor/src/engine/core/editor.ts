import Canvas from './canvas';
import { defaultEditorConfig } from './common/constants';
import Events from './controllers/Events';
import Frame from './controllers/Frame';
import Guidelines from './controllers/Guidelines';
import Guides from './controllers/Guides';
import History from './controllers/History';
import { Objects } from './controllers/objects';
import Personalization from './controllers/Personalization';
import Renderer from './controllers/Renderer';
import Scene from './controllers/Scene';
import Zoom from './controllers/Zoom';
import EventManager from './event-manager';
import State from './state';
import { FontLoader } from './utils/font-loader';
import { DEFAULT_LAYER_LABELS, resolveLayerLabels } from './utils/layer-name';

import type { EditorConfig } from '../types';
import type { EditorState } from './common/interfaces';
import type { FontResolver } from './utils/font-loader';
import type { LayerLabels } from './utils/layer-name';

export class Editor extends EventManager {
  public canvas: Canvas;

  public frame: Frame;

  public zoom: Zoom;

  public guides: Guides;

  public history: History;

  public objects: Objects;

  public scene: Scene;

  public renderer: Renderer;

  public state: EditorState;

  public config: EditorConfig;

  public canvasId: string;

  /** Fonts this editor has made ready; resolved through its own provider */
  public readonly fonts = new FontLoader();

  /** Names given to new layers ("Text 1") */
  public layerLabels: LayerLabels = DEFAULT_LAYER_LABELS;

  protected events: Events;

  protected personalization: Personalization;

  protected guidelines: Guidelines;

  constructor({
    id,
    state,
    config,
    fontResolver,
    layerLabels,
  }: {
    id: string;
    state?: EditorState;
    config: Partial<EditorConfig>;
    /** Loads a family that has no `fontURL`, e.g. via the host's font provider */
    fontResolver?: FontResolver;
    layerLabels?: Partial<LayerLabels>;
  }) {
    super();
    this.fonts.setResolver(fontResolver ?? null);
    this.setLayerLabels(layerLabels);
    this.state = state || new State();
    this.config = {
      ...defaultEditorConfig,
      ...config,
      id,
    };
    this.canvasId = id;
    this.initializeCanvas();
    this.initializeControllers();
    this.state.setEditor(this);
  }

  public initializeCanvas = () => {
    this.canvas = new Canvas({
      id: this.canvasId,
      config: this.config,
      editor: this,
    });
  };

  public initializeControllers = () => {
    const options = {
      canvas: this.canvas.canvas,
      editor: this,
      config: this.config,
      state: this.state,
    };
    this.frame = new Frame(options);
    this.zoom = new Zoom(options);
    this.guides = new Guides(options);
    this.history = new History(options);
    this.objects = new Objects(options);
    this.events = new Events(options);
    this.personalization = new Personalization(options);
    this.scene = new Scene(options);
    this.guidelines = new Guidelines(options);
    this.renderer = new Renderer(this.fonts);
  };

  public setLayerLabels(labels: Partial<LayerLabels> | null | undefined) {
    this.layerLabels = resolveLayerLabels(labels);
  }

  public destroy() {
    this.canvas.destroy();
  }

  // CONTEXT MENU
  public cancelContextMenuRequest = () => {
    this.state.setContextMenuRequest(null);
  };
}
