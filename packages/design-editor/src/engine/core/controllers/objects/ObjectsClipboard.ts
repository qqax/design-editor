import {
  ActiveSelection,
  Group,
} from 'fabric';

import type { Object as FabricObject } from 'fabric';

import { LayerType } from '../../../types';
import { generateId } from '../../utils/id';

interface ObjectsClipboardContext {
  readonly canvas: any;
  readonly editor: any;
  readonly state: any;
  readonly config: any;

  getRefObject(
    id?: string,
  ): FabricObject | null;

  findOneById(
    id: string,
  ): FabricObject | null;

  remove(
    id?: string,
  ): void;

  updateContextObjects(): void;
}

export class ObjectsClipboard {
  public clipboard: FabricObject | null = null;
  public isCut = false;

  private readonly canvas: ObjectsClipboardContext['canvas'];
  private readonly editor: ObjectsClipboardContext['editor'];
  private readonly state: ObjectsClipboardContext['state'];
  private readonly config: ObjectsClipboardContext['config'];

  private readonly remove: ObjectsClipboardContext['remove'];
  private readonly findOneById: ObjectsClipboardContext['findOneById'];
  private readonly updateContextObjects: ObjectsClipboardContext['updateContextObjects'];

  constructor(
    context: ObjectsClipboardContext,
  ) {
    this.canvas = context.canvas;
    this.editor = context.editor;
    this.state = context.state;
    this.config = context.config;

    this.remove = context.remove.bind(context);
    this.findOneById =
      context.findOneById.bind(context);
    this.updateContextObjects =
      context.updateContextObjects.bind(context);
  }

  public cut = () => {
    const activeObject =
      this.canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    this.copy();

    this.isCut = true;

    this.remove();
  };

  public copy = () => {
    const activeObject =
      this.canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    this.clipboard = activeObject;
    this.isCut = false;
  };

  public copyById = (id: string) => {
    const object = this.findOneById(id);

    if (!object) {
      return;
    }

    this.clipboard = object;
    this.isCut = false;
  };

  public clone = async () => {
    const activeObject =
      this.canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    this.canvas.discardActiveObject();

    const duplicates =
      await this.duplicate(activeObject);

    if (!duplicates.length) {
      return;
    }

    const selection =
      new ActiveSelection(
        duplicates,
        {
          canvas: this.canvas,
        },
      );

    this.canvas.setActiveObject(selection);
    this.state.setActiveObject(selection);

    this.canvas.requestRenderAll();

    this.updateContextObjects();

    this.editor.history.save();
  };

  public paste = async () => {
    if (!this.clipboard) {
      return;
    }

    this.canvas.discardActiveObject();

    const duplicates =
      await this.duplicate(this.clipboard);

    if (!duplicates.length) {
      return;
    }

    const selection =
      new ActiveSelection(
        duplicates,
        {
          canvas: this.canvas,
        },
      );

    this.canvas.setActiveObject(selection);
    this.state.setActiveObject(selection);

    this.canvas.requestRenderAll();

    this.updateContextObjects();

    this.editor.history.save();

    this.isCut = false;
  };

  public async duplicate(
    object: FabricObject,
  ): Promise<FabricObject[]> {
    if (!object) {
      return [];
    }

    if (
      object instanceof Group &&
      object.type !== LayerType.STATIC_VECTOR
    ) {
      const children =
        object.getObjects();

      const duplicates =
        await Promise.all(
          children.map(
            (child) =>
              this.duplicate(child),
          ),
        );

      return duplicates.flat();
    }

    const clone =
      await object.clone();

    clone.set({
      id: generateId(),
      left:
        (object.left ?? 0) + 10,
      top:
        (object.top ?? 0) + 10,
    } as any);

    clone.clipPath = undefined;

    if (this.config.clipToFrame) {
      clone.clipPath =
        this.editor.frame.frame;
    }

    clone.setCoords();

    this.canvas.add(clone);

    return [clone];
  }
}