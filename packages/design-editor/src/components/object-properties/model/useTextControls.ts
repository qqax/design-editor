import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '../../../engine';

interface UseTextControlsOptions {
  editor: Editor | null;
  activeObj: any;

}

export const useTextControls = ({ activeObj, editor }: UseTextControlsOptions) => {
  // ── Text-specific state ──────────────────────────────────────────────────
  const [fontFamily, setFontFamily] = useState<string | undefined>(
    () => activeObj?.fontFamily as string | undefined,
  );
  const [charSpacing, setCharSpacing] = useState<number>(
    () => ((activeObj?.charSpacing as number | undefined) ?? 0) / 1000,
  );
  const [lineHeight, setLineHeight] = useState<number>(
    () => (activeObj?.lineHeight as number | undefined) ?? 1.2,
  );
  type TextTransform = 'none' | 'upper' | 'lower' | 'title';
  const [textTransform, setTextTransform] = useState<TextTransform>('none');
  const originalTextRef = useRef<string | undefined>(undefined);

  // ── Text-editing / per-character selection state ─────────────────────────
  // Tracks the styles of the currently selected characters so the toolbar
  // reflects and applies changes to just the selection.
  const [isEditingText, setIsEditingText] = useState(false);
  const [selStyle, setSelStyle] = useState<Record<string, any>>({});

  // Read selection styles from the active Fabric text object
  const readSelectionStyles = useCallback(() => {
    const obj = activeObj;
    if (!obj?.isEditing) return;
    const selStart: number = obj.selectionStart ?? 0;
    const selEnd: number = obj.selectionEnd ?? 0;
    if (selEnd <= selStart) {
      setSelStyle({});
      return;
    }
    // getSelectionStyles returns an array of per-char style objects; merge/pick first
    const styles: Record<string, any>[] =
      obj.getSelectionStyles?.(selStart, selEnd) ?? [];
    if (!styles.length) {
      setSelStyle({});
      return;
    }
    // Merge: if all chars agree on a value, show it; otherwise show the first
    const merged: Record<string, any> = {};
    const keys = new Set(styles.flatMap((s) => Object.keys(s)));
    keys.forEach((k) => {
      const values = styles.map((s) => s[k]).filter((v) => v !== undefined);
      merged[k] = values[0]; // use first char's value as representative
    });
    setSelStyle(merged);
  }, [activeObj]);

  // Subscribe to Fabric text editing events on the active canvas
  useEffect(() => {
    if (!editor) return;
    const fabricCanvas = editor.canvas?.canvas;
    if (!fabricCanvas) return;

    const onEditingEntered = () => {
      setIsEditingText(true);
      readSelectionStyles();
    };
    const onEditingExited = () => {
      setIsEditingText(false);
      setSelStyle({});
    };
    const onSelectionChanged = () => {
      readSelectionStyles();
    };

    fabricCanvas.on('text:editing:entered', onEditingEntered);
    fabricCanvas.on('text:editing:exited', onEditingExited);
    fabricCanvas.on('text:selection:changed', onSelectionChanged);

    return () => {
      fabricCanvas.off('text:editing:entered', onEditingEntered);
      fabricCanvas.off('text:editing:exited', onEditingExited);
      fabricCanvas.off('text:selection:changed', onSelectionChanged);
    };
  }, [editor, readSelectionStyles]);

  useEffect(() => {
    setFontFamily(activeObj?.fontFamily as string | undefined);
    setCharSpacing(
      ((activeObj?.charSpacing as number | undefined) ?? 0) / 1000,
    );
    setLineHeight((activeObj?.lineHeight as number | undefined) ?? 1.2);
    setTextTransform('none');
    originalTextRef.current = undefined;
    // Reset editing state when object changes
    setIsEditingText(false);
    setSelStyle({});
  }, [activeObj?.id]);

  const handleFontChange = useCallback(
    (family: string) => {
      setFontFamily(family);
      editor?.objects.update({ fontFamily: family });
    },
    [editor],
  );

  return {
    isEditingText,
    selStyle,
    fontFamily,
    charSpacing,
    setCharSpacing,
    lineHeight,
    textTransform,
    setTextTransform,
    handleFontChange,
    originalTextRef,
  }
};
