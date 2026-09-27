import React from 'react';

import { X } from 'lucide-react';

import { useMessages } from '../../../messages';
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

import type { PanelKey, TextPreset } from '../../panels';
import type { RenderPropType } from '../../panels/common/model/types';
import type { DesignResource } from '../../panels/common/provider';

interface EditorSidebarProps {
  activePanel: PanelKey | null;
  onClose: () => void;
  templatesPanel?: RenderPropType;
  libraryPanel?: RenderPropType;
  handleApplyTemplate: (template: DesignResource) => void;
  addImageToCanvas: (src: string) => void;
  handleApplyTextDesign: (design: DesignResource) => void;
  handleAddText: (preset: TextPreset) => void;
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

  const m = useMessages();

  if (!activePanel) return null;

  const titles: Record<PanelKey, string> = {
    templates: m.templates.title,
    text: m.textDesigns.title,
    shapes: m.shapes.title,
    stickers: m.stickers.title,
    upload: m.gallery.title,
  };

  return (
    <div data-canvas-overlay className="de-sidebar">
      <div className="de-sidebar-header">
        <span>{titles[activePanel]}</span>
        <button
          aria-label={m.panel.close}
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
              emptyMessage={m.templates.empty}
              errorLoadMoreMessage={m.templates.errorLoadMore}
              errorMessage={m.templates.error}
              noMatchMessage={m.templates.noMatch}
              noResourceAvailableMessage={m.templates.unavailable}
              onApplyResource={handleApplyTemplate}
              placeholder={m.templates.search}
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
            emptyMessage={m.textDesigns.empty}
            errorLoadMoreMessage={m.textDesigns.errorLoadMore}
            errorMessage={m.textDesigns.error}
            noMatchMessage={m.textDesigns.noMatch}
            noResourceAvailableMessage={m.textDesigns.unavailable}
            onAddPlainText={handleAddText}
            onApplyResource={handleApplyTextDesign}
            placeholder={m.textDesigns.search}
            provider={textDesignProvider}
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
              SHAPES_ORDER.map((category) => ({
                ...category,
                label: m.shapes.categories[category.key],
              }))
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
              STICKERS_ORDER.map((category) => ({
                ...category,
                label: m.stickers.categories[category.key],
              }))
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
