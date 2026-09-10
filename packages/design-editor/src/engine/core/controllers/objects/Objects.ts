import { ObjectsAlign } from './ObjectsAlign';
import { ObjectsBackground } from './ObjectsBackground';
import { ObjectsClipboard } from './ObjectsClipboard';
import { ObjectsEffects } from './ObjectsEffects';
import { ObjectsGrouping } from './ObjectsGrouping';
import { ObjectsLayers } from './ObjectsLayers';
import { ObjectsLock } from './ObjectsLock';
import { ObjectsManager } from './ObjectsManager';
import { ObjectsQuery } from './ObjectsQuery';
import { ObjectsSelection } from './ObjectsSelection';
import { ObjectsState } from './ObjectsState';
import { ObjectsStyleClipboard } from './ObjectsStyleClipboard';
import { ObjectsText } from './ObjectsText';
import Base from '../Base';

import type { FabricObject } from 'fabric';

import type { ILayer, ILayerOptions } from '../../../types';
import type {
  Direction,
  GradientOptions,
  ScaleType,
  ShadowOptions,
  Size,
} from '../../common/interfaces';

export class Objects extends Base {
  public readonly query: ObjectsQuery;

  public readonly manager: ObjectsManager;

  public readonly selection: ObjectsSelection;

  public readonly align: ObjectsAlign;

  public readonly clipboardCtrl: ObjectsClipboard;

  public readonly layers: ObjectsLayers;

  public readonly grouping: ObjectsGrouping;

  public readonly lockController: ObjectsLock;

  public readonly background: ObjectsBackground;

  public readonly effects: ObjectsEffects;

  public readonly text: ObjectsText;

  public readonly styleClipboard: ObjectsStyleClipboard;

  public readonly objectsState: ObjectsState;

  /**
   * Backwards compatibility with the old API.
   */
  public clipboard: any = null;

  public isCut = false;

  public copyStyleClipboard: any = null;

  constructor(options: any) {
    super(options);

    const context = {
      canvas: this.canvas,
      editor: this.editor,
      state: this.state,
      config: this.config,

      getRefObject: this.getRefObject,
      findOneById: this.findOneById,
      updateContextObjects: this.updateContextObjects,
    };

    this.query = new ObjectsQuery(context);

    this.objectsState = new ObjectsState(context);

    this.selection = new ObjectsSelection(context);

    this.align = new ObjectsAlign({
      canvas: this.canvas,
      editor: this.editor,
      state: this.state,
      getRefObject: this.getRefObject,
    });

    this.clipboardCtrl = new ObjectsClipboard({
      canvas: this.canvas,
      editor: this.editor,
      state: this.state,
      config: this.config,
      getRefObject: this.getRefObject,
      findOneById: this.findOneById,
      remove: this.remove,
      updateContextObjects: this.updateContextObjects,
    });

    this.layers = new ObjectsLayers(context);

    this.grouping = new ObjectsGrouping(context);

    this.lockController = new ObjectsLock(context);

    this.background = new ObjectsBackground(context);

    this.effects = new ObjectsEffects(context);

    this.text = new ObjectsText(context);

    this.styleClipboard = new ObjectsStyleClipboard(context);

    this.manager = new ObjectsManager(context);
  }

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  public getRefObject = (id?: string): FabricObject | null => {
    if (id) {
      return this.findOneById(id);
    }

    return this.canvas.getActiveObject() ?? null;
  };

  public findByIdInObjecs = (
    id: string,
    objects: FabricObject[]
  ): FabricObject | null => {
    return this.query.findByIdInObjects(id, objects);
  };

  public findById = (id: string) => {
    return this.query.findById(id);
  };

  public findOneById = (id: string): FabricObject | null => {
    return this.query.findOneById(id);
  };

  public findByName = (name: string) => {
    return this.query.findByName(name);
  };

  // ---------------------------------------------------------------------------
  // Objects
  // ---------------------------------------------------------------------------

  public add = async (
    item: Partial<
      ILayer & {
        skipCentering?: boolean;
      }
    >
  ) => {
    return this.manager.add(item);
  };

  public update = (options: Partial<ILayerOptions>, id?: string) => {
    this.manager.update(options, id);
  };

  public clear = () => {
    this.manager.clear();
  };

  public reset = () => {
    this.manager.reset();
  };

  public list = () => {
    return this.query.list();
  };

  // ---------------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------------

  public select = (id?: string) => {
    this.selection.select(id);
  };

  public deselect = () => {
    this.selection.deselect();
  };

  // ---------------------------------------------------------------------------
  // Movement / alignment
  // ---------------------------------------------------------------------------

  public move = (direction: Direction, value: number, id?: string) => {
    const refObject = this.getRefObject(id);

    if (!refObject) {
      return;
    }

    const currentValue = Number(refObject.get(direction) ?? 0);

    refObject.set(direction, currentValue + value);

    refObject.setCoords();

    this.canvas.requestRenderAll();

    this.editor.history.save();
    this.updateContextObjects();
  };

  public position = (position: Direction, value: number, id?: string) => {
    this.align.position(position, value, id);
  };

  public resize = (size: Size, value: number, id?: string) => {
    this.align.resize(size, value, id);
  };

  public scale = (type: ScaleType, id?: string) => {
    this.align.scale(type, id);
  };

  public alignTop = (id?: string) => {
    this.align.alignTop(id);
  };

  public alignMiddle = (id?: string) => {
    this.align.alignMiddle(id);
  };

  public alignBottom = (id?: string) => {
    this.align.alignBottom(id);
  };

  public alignLeft = (id?: string) => {
    this.align.alignLeft(id);
  };

  public alignCenter = (id?: string) => {
    this.align.alignCenter(id);
  };

  public alignRight = (id?: string) => {
    this.align.alignRight(id);
  };

  // ---------------------------------------------------------------------------
  // Clipboard
  // ---------------------------------------------------------------------------

  public cut = () => {
    this.clipboardCtrl.cut();

    this.clipboard = this.clipboardCtrl.clipboard;

    this.isCut = this.clipboardCtrl.isCut;
  };

  public copy = () => {
    this.clipboardCtrl.copy();

    this.clipboard = this.clipboardCtrl.clipboard;

    this.isCut = this.clipboardCtrl.isCut;
  };

  public copyById = (id: string) => {
    this.clipboardCtrl.copyById(id);

    this.clipboard = this.clipboardCtrl.clipboard;

    this.isCut = this.clipboardCtrl.isCut;
  };

  public clone = async () => {
    await this.clipboardCtrl.clone();
  };

  public paste = async () => {
    await this.clipboardCtrl.paste();
  };

  public cloneAudio = async (id: string) => {
    const object = this.findOneById(id);

    if (!object) {
      return;
    }

    this.deselect();

    await this.clipboardCtrl.duplicate(object);

    this.canvas.requestRenderAll();

    this.updateContextObjects();

    this.editor.history.save();
  };

  // ---------------------------------------------------------------------------
  // Background
  // ---------------------------------------------------------------------------

  public unsetBackgroundImage = async () => {
    return this.background.unset();
  };

  public setAsBackgroundImage = async (id?: string) => {
    await this.background.set(id);
  };

  // ---------------------------------------------------------------------------
  // Layers
  // ---------------------------------------------------------------------------

  public bringForward = (id?: string) => {
    this.layers.bringForward(id);
  };

  public bringForwardById = (id: string) => {
    this.layers.bringForwardById(id);
  };

  public bringToFront = (id?: string) => {
    this.layers.bringToFront(id);
  };

  public sendBackwards = (id?: string) => {
    this.layers.sendBackwards(id);
  };

  public sendToBack = (id?: string) => {
    this.layers.sendToBack(id);
  };

  // ---------------------------------------------------------------------------
  // Grouping
  // ---------------------------------------------------------------------------

  public group = () => {
    this.grouping.group();
  };

  public ungroup = () => {
    this.grouping.ungroup();
  };

  // ---------------------------------------------------------------------------
  // Remove
  // ---------------------------------------------------------------------------

  public remove = (id?: string) => {
    this.manager.remove(id);
  };

  public removeById = (id: string) => {
    this.manager.removeById(id);
  };

  public removeByName = (name: string) => {
    this.manager.removeByName(name);
  };

  // ---------------------------------------------------------------------------
  // Lock
  // ---------------------------------------------------------------------------

  public lock = (id?: string) => {
    this.lockController.lock(id);
  };

  public unlock = (id?: string) => {
    this.lockController.unlock(id);
  };

  // ---------------------------------------------------------------------------
  // Style clipboard
  // ---------------------------------------------------------------------------

  public copyStyle = () => {
    this.styleClipboard.copy();

    this.copyStyleClipboard = this.styleClipboard.clipboard;
  };

  public pasteStyle = () => {
    this.styleClipboard.paste();

    this.copyStyleClipboard = null;
  };

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  public setShadow = (options: ShadowOptions) => {
    this.effects.setShadow(options);
  };

  public setGradient = ({ angle, colors }: GradientOptions) => {
    this.effects.setGradient({
      angle,
      colors,
    });
  };

  // ---------------------------------------------------------------------------
  // Text
  // ---------------------------------------------------------------------------

  public toUppercase = (id?: string) => {
    this.text.toUppercase(id);
  };

  public toLowerCase = (id?: string) => {
    this.text.toLowerCase(id);
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  public updateContextObjects = () => {
    this.objectsState.sync();
  };
}
