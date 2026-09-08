import { useCallback, useEffect, useRef, useState } from 'react';

interface UseObjectPropertiesBarOptions {
  activeObj: any;
}

export const useObjectPropertiesBar = ({ activeObj }: UseObjectPropertiesBarOptions) => {
  const type = activeObj?.type as string | undefined;
  const isImage = type === 'StaticImage' || type === 'BackgroundImage';
  const isText = type === 'StaticText' || type === 'DynamicText';
  const isShape = type === 'StaticPath' || type === 'StaticVector';

  const [opacity, setOpacity] = useState(() =>
    Math.round((activeObj?.opacity ?? 1) * 100),
  );
  useEffect(() => {
    setOpacity(Math.round((activeObj?.opacity ?? 1) * 100));
  }, [activeObj?.id]);

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

  const label = isImage
    ? 'Image'
    : isText
      ? 'Text'
      : isShape
        ? 'Shape'
        : 'Object';

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
    label,
    isImage,
    isText,
    isShape,
    opacity,
    setOpacity,
    onDragStart,
  }
};
