import React from 'react';

import { X } from 'lucide-react';

import { useEditorContext } from '../../EditorContext';
import {
  getItemsFactory,
  Panel,
  ResourcePanel,
  SHAPES,
  SHAPES_ORDER,
  STICKERS,
  STICKERS_ORDER,
  UploadPanel,
} from '../../panels';

import type { PanelKey } from '../../panels';
import type { RenderPropType } from '../../panels/common/model/types';
import type { DesignResource } from '../../panels/common/provider';

interface EditorSidebarProps {
  activePanel: PanelKey | null;
  onClose: () => void;
  templatesPanel?: RenderPropType;
  libraryPanel?: RenderPropType;
  handleApplyTemplate: (template: any) => void;
  addImageToCanvas: (src: string) => void;
  handleApplyTextDesign: (design: DesignResource) => void;
  handleAddText: (text: string, size: number) => void;
  handleAddMedia: (url: string) => Promise<void>;
  // setActivePanel: (panel: PanelKey | null) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activePanel,
  onClose,
  templatesPanel,
  libraryPanel,
  handleApplyTemplate,
  addImageToCanvas,
  handleApplyTextDesign,
  handleAddText,
  handleAddMedia,
  // setActivePanel,
}) => {
  const {
    textDesignProvider,
    templateProvider,
    galleryProvider,
    galleryWidget,
  } = useEditorContext();

  if (!activePanel) return null;

  return (
    <div data-canvas-overlay className="de-sidebar">
      <div className="de-sidebar-header">
        <span>{activePanel}</span>
        <button
          aria-label="Close panel"
          className="de-icon-btn"
          onClick={onClose}
          type="button"
        >
          <X size={16} />
        </button>
      </div>

      <div className="de-sidebar-body">
        {activePanel === 'templates' &&
          (templatesPanel ? (
            typeof templatesPanel === 'function' ? (
              templatesPanel({ onAddResource: handleApplyTemplate })
            ) : (
              templatesPanel
            )
          ) : (
            <ResourcePanel
              emptyMessage="No templates in this category"
              errorLoadMoreMessage="Failed to load more templates"
              errorMessage="Failed to load more templates"
              noMatchMessage="No templates match"
              noResourceAvailableMessage="No templates available. Host apps can supply a templateProvider."
              onApplyResource={handleApplyTemplate}
              placeholder="Search templates"
              provider={templateProvider}
            />
          ))}

        {/* {activePanel === 'elements' && ( */}
        {/*  <ElementsPanel */}
        {/*    onAddShape={addImageToCanvas} */}
        {/*    onAddSticker={addImageToCanvas} */}
        {/*    onApplyTextDesign={handleApplyTextDesign} */}
        {/*    onSeeAll={setActivePanel} */}
        {/*    textDesignProvider={textDesignProvider} */}
        {/*  /> */}
        {/* )} */}

        {activePanel === 'text' && (
          <ResourcePanel
            emptyMessage="No text designs in this category"
            errorLoadMoreMessage="Failed to load more text designs"
            errorMessage="Failed to load text designs"
            noMatchMessage="No text designs match"
            noResourceAvailableMessage="No text designs available. Host apps can supply a textDesignProvider."
            onApplyResource={handleApplyTextDesign}
            placeholder="Search text designs"
            provider={textDesignProvider}
            title="Text Designs"
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
              libraryPanel({ onAddResource: handleAddMedia })
            ) : (
              libraryPanel
            )
          ) : (
            <UploadPanel
              onAddToCanvas={(url) => void handleAddMedia(url)}
              provider={galleryProvider}
              widget={galleryWidget}
            />
          ))}
      </div>
    </div>
  );
};
