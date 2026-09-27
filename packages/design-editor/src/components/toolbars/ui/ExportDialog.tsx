'use client';

import React, { useState } from 'react';

import { Download, Loader2 } from 'lucide-react';

import { getStorageSafe, setStorageSafe } from '../../design-editor/lib';
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

const FORMATS: readonly (readonly [ExportFormat, string])[] = [
  ['png', 'PNG'],
  ['jpg', 'JPG'],
  ['webp', 'WebP'],
  ['pdf', 'PDF'],
  ['svg', 'SVG'],
];

const FORMAT_HINTS: Record<ExportFormat, string> = {
  png: 'Lossless, keeps transparency.',
  jpg: 'Smallest files; transparent areas become white.',
  webp: 'Small files, keeps transparency.',
  pdf: 'Print-ready page with a physical size, optional trim box and crop marks.',
  svg: 'Vector. Fonts are linked by URL and images by their source, so they must stay reachable.',
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
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportTarget | null>(null);
  const [settings, setSettings] = useState<ExportSettings>(() =>
    sanitizeExportSettings(getStorageSafe<unknown>(STORAGE_KEY, null))
  );

  const update = (patch: Partial<ExportSettings>) => {
    setSettings((prev) => {
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
          aria-label="Export"
          className="de-btn"
          data-size="md"
          data-variant="primary"
          disabled={!editor}
          type="button"
        >
          <Download size={15} />
          <span className="de-hide-mobile">Export</span>
        </button>
      </DialogTrigger>
      <DialogContent className="de-export-dialog">
        <DialogTitle>Export</DialogTitle>
        <div className="de-form">
          <Segmented
            label="Format"
            onChange={(next) => update({ format: next })}
            options={FORMATS}
            value={format}
          />
          <DialogDescription className="de-form-hint">
            {FORMAT_HINTS[format]}
          </DialogDescription>

          {isRaster ? (
            <div className="de-form-section">
              <div className="de-form-section-title">
                {format === 'pdf' ? 'Image resolution' : 'Size'}
              </div>
              <Segmented
                label="Scale"
                onChange={(next) => update({ scale: Number(next) })}
                value={String(settings.scale)}
                options={EXPORT_SCALES.map(
                  (scale) => [String(scale), `${scale}×`] as const
                )}
              />
              {usesQuality ? (
                <div className="de-form-row">
                  <span className="de-form-label">Quality</span>
                  <input
                    aria-label="Quality"
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
              <div className="de-form-section-title">Print</div>
              <Segmented
                label="Page resolution"
                onChange={(next) => update({ dpi: Number(next) })}
                value={String(settings.dpi)}
                options={EXPORT_DPIS.map(
                  (dpi) => [String(dpi), `${dpi} dpi`] as const
                )}
              />
              <Segmented
                label="Image compression"
                onChange={(pdfImage) => update({ pdfImage })}
                value={settings.pdfImage}
                options={[
                  ['lossless', 'Lossless'],
                  ['jpeg', 'JPEG'],
                ]}
              />
              <div className="de-form-row">
                <span className="de-form-label">Trim at page offsets</span>
                <Switch
                  aria-label="Trim at page offsets"
                  checked={settings.trimAtOffsets ? hasOffsets(offsets) : false}
                  disabled={!hasOffsets(offsets)}
                  onCheckedChange={(trimAtOffsets) => update({ trimAtOffsets })}
                />
              </div>
              <div className="de-form-row">
                <span className="de-form-label">Crop marks</span>
                <Switch
                  aria-label="Crop marks"
                  checked={settings.cropMarks}
                  onCheckedChange={(cropMarks) => update({ cropMarks })}
                />
              </div>
              {hasOffsets(offsets) ? null : (
                <div className="de-form-hint">
                  Set page offsets in Settings to mark the bleed: the trim box
                  then sits at the offset guides.
                </div>
              )}
            </div>
          ) : null}

          <div className="de-export-summary">
            <span>{summary.pixels}</span>
            {summary.page ? <span>Page {summary.page}</span> : null}
            {summary.trim ? <span>Trim {summary.trim}</span> : null}
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
            Download
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
              Save to library
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
