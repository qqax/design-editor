'use client';

import React, { useRef, useState } from 'react';

import { CloudUpload, Loader2, Trash2 } from 'lucide-react';

import { useToast } from '../../../../hooks/useToast';
import { useMessages } from '../../../../messages';
import { useGallery } from '../model';

import type {
  GalleryItem,
  GalleryProvider,
  GalleryWidget,
} from '../../../../providers';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface Props {
  provider: GalleryProvider;
  widget?: GalleryWidget;
  onAddToCanvas: (url: string) => void;
}

function Preview({
  item,
  fallbackName,
}: {
  item: GalleryItem;
  fallbackName: string;
}) {
  const src = item.thumbnailUrl ?? item.url;
  return item.type === 'video' && !item.thumbnailUrl ? (
    <video muted className="de-gallery-media" preload="metadata" src={src} />
  ) : (
    <img
      alt={item.name ?? fallbackName}
      className="de-gallery-media"
      draggable={false}
      src={src}
    />
  );
}

export function UploadPanel({ provider, widget, onAddToCanvas }: Props) {
  const m = useMessages().gallery;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { items, loading, error, refresh, upload, remove } =
    useGallery(provider);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !upload) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error(m.tooLarge);
      return;
    }
    setIsUploading(true);
    try {
      const item = await upload(file);
      if (item) onAddToCanvas(item.url);
      toast.success(m.uploaded);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : m.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="de-gallery">
      {widget ? (
        <div className="de-gallery-widget">
          {widget({ refresh, addToCanvas: onAddToCanvas })}
        </div>
      ) : null}

      {upload ? (
        <React.Fragment>
          <input
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={(e) => void handleFileChange(e)}
            style={{ display: 'none' }}
            type="file"
          />
          <button
            className="de-gallery-upload"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            {isUploading ? (
              <Loader2 className="de-spin" size={28} />
            ) : (
              <CloudUpload size={28} />
            )}
            <span className="de-gallery-upload-title">
              {isUploading ? m.uploading : m.upload}
            </span>
            <span className="de-gallery-upload-hint">{m.hint}</span>
          </button>
        </React.Fragment>
      ) : null}

      <div className="de-gallery-list">
        {loading ? (
          <div className="de-gallery-empty">
            <Loader2 className="de-spin" size={22} />
          </div>
        ) : error ? (
          <div className="de-gallery-empty">{error}</div>
        ) : items.length === 0 ? (
          <div className="de-gallery-empty">{m.empty}</div>
        ) : (
          <div className="de-gallery-grid">
            {items.map((item) => (
              <div key={item.id} className="de-gallery-item">
                <button
                  aria-label={m.add(item.name ?? m.item)}
                  className="de-gallery-add"
                  onClick={() => onAddToCanvas(item.url)}
                  type="button"
                >
                  <Preview fallbackName={m.item} item={item} />
                </button>
                {remove ? (
                  <button
                    aria-label={m.remove(item.name ?? m.item)}
                    className="de-gallery-remove"
                    onClick={() => void remove(item.id)}
                    title={m.removeHint}
                    type="button"
                  >
                    <Trash2 size={13} />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
