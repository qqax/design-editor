import React from 'react';

import { getItemsFactory, Panel } from '../../panels/common';
import { ElementsPanel } from '../../panels/elements-panel';
import { SHAPES, SHAPES_ORDER } from '../../panels/shapes-panel';
import { STICKERS, STICKERS_ORDER } from '../../panels/stickers-panel';
import { TemplatesPanel } from '../../panels/templates/TemplatesPanel';
import { TextPanel } from '../../panels/text/TextPanel';
import { UploadPanel } from '../../panels/UploadPanel';

import type { TextDesign, TextDesignProvider } from '../../../providers';
import type { PanelKey } from '../../icon-reail';
import type {
  LibraryPanelRenderProp,
  TemplatesPanelRenderProp,
} from '../model';

interface EditorSidebarProps {
  activePanel: PanelKey | null;
  onClose: () => void;
  templatesPanel?: TemplatesPanelRenderProp;
  libraryPanel?: LibraryPanelRenderProp;
  templateProvider: any;
  textDesignProvider: TextDesignProvider;
  handleApplyTemplate: (template: any) => void;
  addImageToCanvas: (src: string) => void;
  handleApplyTextDesign: (design: TextDesign) => void;
  handleAddText: (text: string, size: number) => void;
  handleAddMedia: (url: string) => Promise<void>;
  setActivePanel: (panel: PanelKey | null) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activePanel,
  onClose,
  templatesPanel,
  libraryPanel,
  templateProvider,
  textDesignProvider,
  handleApplyTemplate,
  addImageToCanvas,
  handleApplyTextDesign,
  handleAddText,
  handleAddMedia,
  setActivePanel,
}) => {
  if (!activePanel) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 64,
        bottom: 0,
        width: 320,
        background: 'var(--de-color-bg-elevated)',
        borderRight: '1px solid var(--de-color-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 12px 0 12px',
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'capitalize',
            color: 'var(--de-color-text)',
          }}
        >
          {activePanel}
        </span>
        <button
          onClick={onClose}
          type="button"
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: 18,
            color: 'var(--de-color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: 4,
          }}
        >
          ×
        </button>
      </div>

      {/* Content Switcher */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {activePanel === 'templates' &&
          (templatesPanel ? (
            typeof templatesPanel === 'function' ? (
              templatesPanel({ onApplyTemplate: handleApplyTemplate })
            ) : (
              templatesPanel
            )
          ) : (
            <TemplatesPanel
              onApplyTemplate={handleApplyTemplate}
              provider={templateProvider}
            />
          ))}

        {activePanel === 'elements' && (
          <ElementsPanel
            onAddShape={addImageToCanvas}
            onAddSticker={addImageToCanvas}
            onApplyTextDesign={handleApplyTextDesign}
            onSeeAll={setActivePanel}
            textDesignProvider={textDesignProvider}
          />
        )}

        {activePanel === 'text' && (
          <TextPanel
            onApplyTextDesign={handleApplyTextDesign}
            provider={textDesignProvider}
            onAddPlainText={(preset) => {
              const map = { heading: 72, subheading: 48, body: 28 } as const;
              handleAddText(preset, map[preset]);
            }}
          />
        )}

        {activePanel === 'shapes' && (
          <Panel
            onAddItem={addImageToCanvas}
            getItems={getItemsFactory(
              SHAPES.map((shape) => ({
                ...shape,
                src: `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/shapes/${shape.category}/${shape.file}`,
              })),
              SHAPES_ORDER
            )}
          />
        )}

        {activePanel === 'stickers' && (
          <Panel
            onAddItem={addImageToCanvas}
            getItems={getItemsFactory(
              STICKERS.map((sticker) => ({
                ...sticker,
                src: `https://cdn.jsdelivr.net/gh/qqax/design-editor/assets/stickers/${sticker.category}/${sticker.file}`,
              })),
              STICKERS_ORDER
            )}
          />
        )}

        {activePanel === 'upload' &&
          (libraryPanel ? (
            typeof libraryPanel === 'function' ? (
              libraryPanel({ onAddMedia: handleAddMedia })
            ) : (
              libraryPanel
            )
          ) : (
            <UploadPanel onUploadFile={handleAddMedia} />
          ))}
      </div>
    </div>
  );
};
