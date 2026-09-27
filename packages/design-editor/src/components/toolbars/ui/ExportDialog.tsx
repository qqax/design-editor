'use client';

import React, { useState } from 'react';

import { Download, Loader2 } from 'lucide-react';

import { useMessages } from '../../../messages';
import { getStorageSafe, setStorageSafe } from '../../design-editor/lib';
import { useEditorContext } from '../../EditorContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Segmented,
  Switch,
} from '../../primitives';
import {
  describeOutput,
  EXPORT_DPIS,
  EXPORT_SCALES,
  hasOffsets,
  sanitizeExportSettings,
  toExportOptions,
} from '../model';

import type {
  Editor,
  ExportFormat,
  ExportOptions,
  PageOffsets,
} from '../../../engine';
import type { ExportSettings, ExportTarget } from '../model';

const STORAGE_KEY = 'studio_export';

const FORMAT_LABELS: Record<ExportFormat, string> = {
  png: 'PNG',
  jpg: 'JPG',
  webp: 'WebP',
  pdf: 'PDF',
  svg: 'SVG',
};

interface ExportDialogProps {
  editor: Editor | null;
  offsets: PageOffsets;
  /** Shows "Save to library" (the host's onExport) next to Download */
  canSaveToLibrary: boolean;
  onExport: (options: ExportOptions, target: ExportTarget) => Promise<boolean>;
}

export function ExportDialog({
  editor,
  offsets,
  canSaveToLibrary,
  onExport,
}: ExportDialogProps) {
  const m = useMessages().export;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportTarget | null>(null);
  const { exportFormats } = useEditorContext();
  const [stored, setStored] = useState<ExportSettings>(() =>
    sanitizeExportSettings(getStorageSafe<unknown>(STORAGE_KEY, null))
  );
  // The remembered format may be one the host does not offer.
  const settings: ExportSettings = exportFormats.includes(stored.format)
    ? stored
    : { ...stored, format: exportFormats[0] ?? 'png' };

  const update = (patch: Partial<ExportSettings>) => {
    setStored((prev) => {
      const next = { ...prev, ...patch };
      setStorageSafe(STORAGE_KEY, next);
      return next;
    });
  };

  const frame = editor
    ? { width: editor.frame.frame.width, height: editor.frame.frame.height }
    : { width: 0, height: 0 };
  const summary = describeOutput(settings, frame, offsets);
  const { format } = settings;
  const isRaster = format !== 'svg';
  const usesQuality =
    format === 'jpg' ||
    format === 'webp' ||
    (format === 'pdf' && settings.pdfImage === 'jpeg');

  const run = async (target: ExportTarget) => {
    setBusy(target);
    try {
      if (await onExport(toExportOptions(settings, offsets), target)) {
        setOpen(false);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button
          aria-label={m.title}
          className="de-btn"
          data-size="md"
          data-variant="primary"
          disabled={!editor}
          type="button"
        >
          <Download size={15} />
          <span className="de-hide-mobile">{m.title}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="de-export-dialog">
        <DialogTitle>{m.title}</DialogTitle>
        <div className="de-form">
          <Segmented
            label={m.format}
            onChange={(next) => update({ format: next })}
            value={format}
            options={exportFormats.map(
              (option) => [option, FORMAT_LABELS[option]] as const
            )}
          />
          <DialogDescription className="de-form-hint">
            {m.hints[format]}
          </DialogDescription>

          {isRaster ? (
            <div className="de-form-section">
              <div className="de-form-section-title">
                {format === 'pdf' ? m.imageResolution : m.size}
              </div>
              <Segmented
                label={m.scale}
                onChange={(next) => update({ scale: Number(next) })}
                value={String(settings.scale)}
                options={EXPORT_SCALES.map(
                  (scale) => [String(scale), `${scale}×`] as const
                )}
              />
              {usesQuality ? (
                <div className="de-form-row">
                  <span className="de-form-label">{m.quality}</span>
                  <input
                    aria-label={m.quality}
                    className="de-range"
                    max={100}
                    min={10}
                    type="range"
                    value={Math.round(settings.quality * 100)}
                    onChange={(e) =>
                      update({ quality: Number(e.target.value) / 100 })
                    }
                  />
                  <span className="de-form-value">
                    {Math.round(settings.quality * 100)}%
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          {format === 'pdf' ? (
            <div className="de-form-section">
              <div className="de-form-section-title">{m.print}</div>
              <Segmented
                label={m.pageResolution}
                onChange={(next) => update({ dpi: Number(next) })}
                value={String(settings.dpi)}
                options={EXPORT_DPIS.map(
                  (dpi) => [String(dpi), m.dpi(dpi)] as const
                )}
              />
              <Segmented
                label={m.compression}
                onChange={(pdfImage) => update({ pdfImage })}
                value={settings.pdfImage}
                options={[
                  ['lossless', m.lossless],
                  ['jpeg', m.jpeg],
                ]}
              />
              <div className="de-form-row">
                <span className="de-form-label">{m.trimAtOffsets}</span>
                <Switch
                  aria-label={m.trimAtOffsets}
                  checked={settings.trimAtOffsets ? hasOffsets(offsets) : false}
                  disabled={!hasOffsets(offsets)}
                  onCheckedChange={(trimAtOffsets) => update({ trimAtOffsets })}
                />
              </div>
              <div className="de-form-row">
                <span className="de-form-label">{m.cropMarks}</span>
                <Switch
                  aria-label={m.cropMarks}
                  checked={settings.cropMarks}
                  onCheckedChange={(cropMarks) => update({ cropMarks })}
                />
              </div>
              {hasOffsets(offsets) ? null : (
                <div className="de-form-hint">{m.offsetsHint}</div>
              )}
            </div>
          ) : null}

          <div className="de-export-summary">
            <span>{m.pixels(summary.width, summary.height)}</span>
            {summary.page ? (
              <span>
                {m.page(
                  summary.page.width,
                  summary.page.height,
                  summary.page.dpi
                )}
              </span>
            ) : null}
            {summary.trim ? (
              <span>{m.trim(summary.trim.width, summary.trim.height)}</span>
            ) : null}
          </div>
        </div>

        <div className="de-dialog-actions">
          <button
            className="de-btn"
            data-size="md"
            data-variant={canSaveToLibrary ? 'secondary' : 'primary'}
            disabled={busy !== null}
            onClick={() => void run('download')}
            type="button"
          >
            {busy === 'download' ? (
              <Loader2 className="de-spin" size={15} />
            ) : (
              <Download size={15} />
            )}
            {m.download}
          </button>
          {canSaveToLibrary ? (
            <button
              className="de-btn"
              data-size="md"
              data-variant="primary"
              disabled={busy !== null}
              onClick={() => void run('library')}
              type="button"
            >
              {busy === 'library' ? (
                <Loader2 className="de-spin" size={15} />
              ) : null}
              {m.saveToLibrary}
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
