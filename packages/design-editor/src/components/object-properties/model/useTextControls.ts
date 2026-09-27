import { useCallback, useEffect, useState } from 'react';

import { transformText } from './transformText';

import type { Textbox, TextStyleDeclaration } from 'fabric';

import type { TextTransform } from './types';
import type { Editor } from '../../../engine';

interface UseTextControlsOptions {
  editor: Editor | null;
  activeObj: Textbox | null | undefined;
}

export const useTextControls = ({
  activeObj,
  editor,
}: UseTextControlsOptions) => {
  const [fontFamily, setFontFamily] = useState(activeObj?.fontFamily);
  const [charSpacing, setCharSpacing] = useState(
    (activeObj?.charSpacing ?? 0) / 1000
  );
  const [lineHeight, setLineHeight] = useState(activeObj?.lineHeight ?? 1.2);
  const [textTransform, setTextTransform] = useState<TextTransform>('none');
  const [originalText, setOriginalText] = useState<string | undefined>();

  // Styles of the selected characters while the text is being edited, so the
  // toolbar reflects and changes just the selection.
  const [isEditingText, setIsEditingText] = useState(false);
  const [selStyle, setSelStyle] = useState<Partial<TextStyleDeclaration>>({});

  const [prevObj, setPrevObj] = useState(activeObj);
  if (activeObj !== prevObj) {
    setPrevObj(activeObj);
    setFontFamily(activeObj?.fontFamily);
    setCharSpacing((activeObj?.charSpacing ?? 0) / 1000);
    setLineHeight(activeObj?.lineHeight ?? 1.2);
    setTextTransform('none');
    setOriginalText(undefined);
    setIsEditingText(false);
    setSelStyle({});
  }

  const readSelectionStyles = useCallback(() => {
    if (!activeObj?.isEditing) return;
    const { selectionStart, selectionEnd } = activeObj;
    if (selectionEnd <= selectionStart) {
      setSelStyle({});
      return;
    }
    // First defined value per property, starting at the first character
    const styles = activeObj.getSelectionStyles(selectionStart, selectionEnd);
    setSelStyle(
      styles.reduce<Partial<TextStyleDeclaration>>(
        (merged, style) => ({ ...style, ...merged }),
        {}
      )
    );
  }, [activeObj]);

  useEffect(() => {
    if (!editor) return;
    const fabricCanvas = editor.canvas.canvas;

    const onEditingEntered = () => {
      setIsEditingText(true);
      readSelectionStyles();
    };
    const onEditingExited = () => {
      setIsEditingText(false);
      setSelStyle({});
    };

    fabricCanvas.on('text:editing:entered', onEditingEntered);
    fabricCanvas.on('text:editing:exited', onEditingExited);
    fabricCanvas.on('text:selection:changed', readSelectionStyles);

    return () => {
      fabricCanvas.off('text:editing:entered', onEditingEntered);
      fabricCanvas.off('text:editing:exited', onEditingExited);
      fabricCanvas.off('text:selection:changed', readSelectionStyles);
    };
  }, [editor, readSelectionStyles]);

  const applyTextTransform = useCallback(
    (transform: TextTransform) => {
      const base = originalText ?? activeObj?.text ?? '';
      setOriginalText(transform === 'none' ? undefined : base);
      setTextTransform(transform);
      editor?.objects.update({ text: transformText(base, transform) });
    },
    [activeObj, editor, originalText]
  );

  const handleFontChange = useCallback(
    (family: string) => {
      setFontFamily(family);
      editor?.objects.update({ fontFamily: family });
    },
    [editor]
  );

  return {
    isEditingText,
    selStyle,
    fontFamily,
    charSpacing,
    setCharSpacing,
    lineHeight,
    setLineHeight,
    textTransform,
    applyTextTransform,
    handleFontChange,
  };
};
