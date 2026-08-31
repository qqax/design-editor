import {
  StaticText,
} from '../../../objects';

import { LayerType } from '../../../types';

import type { ObjectsContext } from './ObjectsContext';

export class ObjectsText {
  constructor(
    private readonly context: ObjectsContext,
  ) {}

  private transform = (
    transform: (value: string) => string,
    id?: string,
  ) => {
    const refObject =
      this.context.getRefObject(id) as
        | StaticText
        | null;

    if (
      !refObject ||
      refObject.type !== LayerType.STATIC_TEXT
    ) {
      return;
    }

    if (refObject.isEditing) {
      if (!refObject.hiddenTextarea) {
        return;
      }

      refObject.hiddenTextarea.value =
        transform(
          refObject.hiddenTextarea.value,
        );

      refObject.updateFromTextArea();

      this.context.canvas.requestRenderAll();

      return;
    }

    refObject.text = transform(
      refObject.text,
    );

    refObject.setCoords();

    this.context.canvas.requestRenderAll();

    this.context.editor.history.save();
    this.context.updateContextObjects();
  };

  public toUppercase = (id?: string) => {
    this.transform(
      (value) => value.toUpperCase(),
      id,
    );
  };

  public toLowerCase = (id?: string) => {
    this.transform(
      (value) => value.toLowerCase(),
      id,
    );
  };
}

export default ObjectsText;