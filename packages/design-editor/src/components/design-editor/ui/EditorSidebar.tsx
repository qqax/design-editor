import React from 'react';
import type { PanelKey } from '../../IconRail';
import { TemplatesPanel } from '../../panels/templates/TemplatesPanel';
import { ElementsPanel } from '../../panels/ElementsPanel';
import { TextPanel } from '../../panels/text/TextPanel';
import { ShapesPanel } from '../../panels/ShapesPanel';
import { StickersPanel } from '../../panels/StickersPanel';
import { UploadPanel } from '../../panels/UploadPanel';
import type { LibraryPanelRenderProp, TemplatesPanelRenderProp } from "../model";
import type { TextDesignProvider, TextDesign } from '../../../providers';

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
        width: 320,
        background: 'var(--color-surface, var(--de-color-bg-elevated))',
        borderRight: '1px solid var(--color-border, var(--de-color-border))',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 12px 0 12px' }}>
        <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize', color: 'var(--color-text)' }}>
          {activePanel}
        </span>
        <button
          onClick={onClose}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: 18,
            color: 'var(--color-text-muted)',
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
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activePanel === 'templates' && (
          templatesPanel ? (
            typeof templatesPanel === 'function' ? templatesPanel({ onApplyTemplate: handleApplyTemplate }) : templatesPanel
          ) : (
            <TemplatesPanel onApplyTemplate={handleApplyTemplate} provider={templateProvider} />
          )
        )}

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

        {activePanel === 'shapes' && <ShapesPanel onAddShape={addImageToCanvas} />}

        {activePanel === 'stickers' && <StickersPanel onAddSticker={addImageToCanvas} />}

        {activePanel === 'upload' && (
          libraryPanel ? (
            typeof libraryPanel === 'function' ? libraryPanel({ onAddMedia: handleAddMedia }) : libraryPanel
          ) : (
            <UploadPanel onUploadFile={handleAddMedia} />
          )
        )}
      </div>
    </div>
  );
};
