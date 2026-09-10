// ── Image "more" popover ─────────────────────────────────────────────────
import { Editor } from '../../../engine';
import { useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Opacity } from './Opacity';

interface ImageMoreContentProps {
  editor: Editor | null;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  shadowEnabled: boolean;
  setShadowEnabled: (enabled: boolean) => void;
}

export const ImageMoreContent = ({
                            editor,
                            borderRadius,
                            setBorderRadius,
                            shadowEnabled,
                            setShadowEnabled,
                            opacity,
                            setOpacity,
                          }: ImageMoreContentProps) => {
  const handleBorderRadius = useCallback(
    (val: number) => {
      setBorderRadius(val);
      editor?.objects.update({ rx: val, ry: val } as any);
    },
    [editor],
  );

  const handleToggleShadow = useCallback(() => {
    const next = !shadowEnabled;
    setShadowEnabled(next);
    if (next) {
      editor?.objects.update({
        shadow: {
          color: 'rgba(0,0,0,0.35)',
          blur: 12,
          offsetX: 4,
          offsetY: 4,
        },
      });
    } else {
      editor?.objects.update({ shadow: undefined });
    }
  }, [editor, shadowEnabled]);

  return <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '14px 16px',
      minWidth: 220,
      background: 'var(--de-color-surface)',
      border: '1px solid var(--de-color-border)',
      borderRadius: 12,
      boxShadow: '0 8px 32px var(--shadow-color)',
    }}
  >
    <div
      style={{
        fontWeight: 700,
        fontSize: 11,
        color: 'var(--de-color-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      Image Settings
    </div>
    {/* Border radius */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
          <span style={{ fontSize: 12, color: 'var(--de-color-text-muted)' }}>
            Corner Radius
          </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--de-color-text)',
            minWidth: 36,
            textAlign: 'right',
          }}
        >
            {borderRadius}px
          </span>
      </div>
      <input
        max={200}
        min={0}
        onChange={(e) => handleBorderRadius(Number(e.target.value))}
        step={1}
        type="range"
        value={borderRadius}
        style={{
          width: '100%',
          accentColor: 'var(--de-color-primary)',
          cursor: 'pointer',
        }}
      />
    </div>
    {/* Shadow toggle */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
        <span style={{ fontSize: 12, color: 'var(--de-color-text-muted)' }}>
          Drop Shadow
        </span>
      <button
        onClick={handleToggleShadow}
        style={{
          padding: '4px 12px',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 600,
          background: shadowEnabled
            ? 'color-mix(in srgb, var(--de-color-primary) 15%, transparent)'
            : 'color-mix(in srgb, var(--de-color-text) 5%, transparent)',
          border: shadowEnabled
            ? '1.5px solid var(--de-color-primary)'
            : '1px solid var(--de-color-border)',
          color: shadowEnabled
            ? 'var(--de-color-primary)'
            : 'var(--de-color-text-muted)',
          outline: 'none',
          transition: 'all 0.15s',
        }}
      >
        {shadowEnabled ? 'On' : 'Off'}
      </button>
    </div>
    {/* Fit / Fill */}
    <div>
        <span
          style={{
            fontSize: 12,
            color: 'var(--de-color-text-muted)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Fit Mode
        </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[
          {
            label: 'Fit',
            title: 'Fit image inside frame',
            icon: <Minimize2 size={12} />,
          },
          {
            label: 'Fill',
            title: 'Fill frame with image',
            icon: <Maximize2 size={12} />,
          },
        ].map(({ label, title, icon }) => (
          <button
            key={label}
            title={title}
            onClick={() => {
              // Use scaleToFit or scaleToFill patterns
              if (label === 'Fit') {
                editor?.objects.update({ objectFit: 'contain' } as any);
              } else {
                editor?.objects.update({ objectFit: 'cover' } as any);
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--de-color-primary)';
              e.currentTarget.style.color = 'var(--de-color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--de-color-border)';
              e.currentTarget.style.color = 'var(--de-color-text-muted)';
            }}
            style={{
              flex: 1,
              height: 30,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background:
                'color-mix(in srgb, var(--de-color-text) 5%, transparent)',
              border: '1px solid var(--de-color-border)',
              color: 'var(--de-color-text-muted)',
              borderRadius: 6,
              outline: 'none',
              transition: 'all 0.15s',
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
    {/* Opacity */}
   <Opacity opacity={opacity} setOpacity={setOpacity} editor={editor} />
  </div>;
};