import { useCallback } from 'react';

import { Maximize2, Minimize2 } from 'lucide-react';

import { Opacity } from './Opacity';
import { useMessages } from '../../../messages';
import { Switch } from '../../primitives';

import type { Editor } from '../../../engine';

interface ImageMoreContentProps {
  editor: Editor | null;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  shadowEnabled: boolean;
  setShadowEnabled: (enabled: boolean) => void;
}

const SHADOW = { color: 'rgba(0,0,0,0.35)', blur: 12, offsetX: 4, offsetY: 4 };

export const ImageMoreContent = ({
  editor,
  borderRadius,
  setBorderRadius,
  shadowEnabled,
  setShadowEnabled,
  opacity,
  setOpacity,
}: ImageMoreContentProps) => {
  const m = useMessages().image;

  const handleBorderRadius = useCallback(
    (radius: number) => {
      setBorderRadius(radius);
      editor?.objects.update({ cornerRadius: radius });
    },
    [editor, setBorderRadius]
  );

  const handleShadow = useCallback(
    (enabled: boolean) => {
      setShadowEnabled(enabled);
      editor?.objects.update({ shadow: enabled ? SHADOW : undefined });
    },
    [editor, setShadowEnabled]
  );

  return (
    <div className="de-form" style={{ minWidth: 220 }}>
      <div className="de-popover-title">{m.settings}</div>
      <div className="de-form-field">
        <div className="de-form-row">
          <span className="de-form-label">{m.cornerRadius}</span>
          <span className="de-form-value">{borderRadius}px</span>
        </div>
        <input
          aria-label={m.cornerRadius}
          className="de-range"
          max={200}
          min={0}
          onChange={(e) => handleBorderRadius(Number(e.target.value))}
          step={1}
          type="range"
          value={borderRadius}
        />
      </div>
      <div className="de-form-row">
        <span className="de-form-label">{m.shadow}</span>
        <Switch
          aria-label={m.shadow}
          checked={shadowEnabled}
          onCheckedChange={handleShadow}
        />
      </div>
      <div className="de-form-field">
        <span className="de-form-label">{m.fitMode}</span>
        <div className="de-form-grid">
          <button
            className="de-btn"
            data-size="sm"
            data-variant="secondary"
            onClick={() => editor?.objects.scale('fit')}
            title={m.fitHint}
            type="button"
          >
            <Minimize2 size={12} />
            {m.fit}
          </button>
          <button
            className="de-btn"
            data-size="sm"
            data-variant="secondary"
            onClick={() => editor?.objects.scale('fill')}
            title={m.fillHint}
            type="button"
          >
            <Maximize2 size={12} />
            {m.fill}
          </button>
        </div>
      </div>
      <Opacity editor={editor} opacity={opacity} setOpacity={setOpacity} />
    </div>
  );
};
