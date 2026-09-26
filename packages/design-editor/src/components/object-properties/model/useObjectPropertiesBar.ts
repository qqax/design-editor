import { useCallback, useEffect, useRef, useState } from 'react';

interface UseObjectPropertiesBarOptions {
  activeObj: any;
}

export type ObjectKind =
  'text' | 'image' | 'shape' | 'group' | 'selection' | 'object';

const TEXT_TYPES = ['StaticText', 'DynamicText'];
const IMAGE_TYPES = ['StaticImage', 'BackgroundImage'];
const SHAPE_TYPES = ['StaticPath', 'StaticVector'];
const PAGE_TYPES = ['Frame', 'Background'];

// Fabric 7 reports these types in lower case
const isActiveSelection = (obj: any) =>
  (obj?.type as string | undefined)?.toLowerCase() === 'activeselection';

const getObjectKind = (obj: any): ObjectKind | null => {
  const type = obj?.type as string | undefined;
  if (!type || PAGE_TYPES.includes(type)) return null;
  if (TEXT_TYPES.includes(type)) return 'text';
  if (IMAGE_TYPES.includes(type)) return 'image';
  if (SHAPE_TYPES.includes(type)) return 'shape';
  if (isActiveSelection(obj)) {
    const selected: any[] = obj.getObjects();
    return selected.every((o) => TEXT_TYPES.includes(o.type))
      ? 'text'
      : 'selection';
  }
  if (type.toLowerCase() === 'group') return 'group';
  return 'object';
};

const LABELS: Record<ObjectKind, string> = {
  text: 'Text',
  image: 'Image',
  shape: 'Shape',
  group: 'Group',
  selection: 'Selection',
  object: 'Object',
};

export const useObjectPropertiesBar = ({ activeObj }: UseObjectPropertiesBarOptions) => {
  const kind = getObjectKind(activeObj);
  const selected: any[] = isActiveSelection(activeObj)
    ? activeObj.getObjects()
    : [];
  const multiple = selected.length > 1;
  const target = kind === 'text' && multiple ? selected[0] : activeObj;

  const [opacity, setOpacity] = useState(() =>
    Math.round((target?.opacity ?? 1) * 100),
  );
  useEffect(() => {
    setOpacity(Math.round((target?.opacity ?? 1) * 100));
  }, [target]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Drag state — null means use default centered position
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).tagName === 'INPUT' ||
      (e.target as HTMLElement).tagName === 'SELECT'
    )
      return;
    e.preventDefault();
    const bar = (e.currentTarget as HTMLDivElement).parentElement!;
    const rect = bar.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
    };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPos({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const label = kind
    ? `${LABELS[kind]}${multiple ? ` ×${selected.length}` : ''}`
    : '';

  const posStyle: React.CSSProperties = isMobile
    ? {
      position: 'absolute',
      bottom: 12,
      left: 12,
      right: 12,
      transform: 'none',
      width: 'auto',
    }
    : pos
      ? {
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: 'none',
        bottom: 'auto',
      }
      : {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
      };

  return {
    posStyle,
    kind,
    target,
    multiple,
    label,
    opacity,
    setOpacity,
    onDragStart,
  }
};
