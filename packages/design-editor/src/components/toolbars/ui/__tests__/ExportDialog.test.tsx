// Created by Claude (Claude Code).
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NO_OFFSETS } from '../../../../engine';
import { EditorContextProvider } from '../../../EditorContext';
import { ExportDialog } from '../ExportDialog';

import type { Editor } from '../../../../engine';
import type { EditorContextValue } from '../../../EditorContext';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const editor = {
  frame: { frame: { width: 1000, height: 500 } },
} as unknown as Editor;

const open = (context: Partial<EditorContextValue>, onExport = vi.fn()) => {
  render(
    <EditorContextProvider
      value={
        { exportFormats: ['png', 'pdf'], ...context } as EditorContextValue
      }
    >
      <ExportDialog
        canSaveToLibrary={false}
        dpi={300}
        editor={editor}
        offsets={NO_OFFSETS}
        onDpiChange={() => {}}
        onExport={onExport}
      />
    </EditorContextProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Export' }));
};

describe('ExportDialog', () => {
  it('offers only the formats the host allows', () => {
    open({});
    const formats = screen
      .getAllByRole('radio')
      .map((radio) => radio.textContent)
      .slice(0, 2);
    expect(formats).toEqual(['PNG', 'PDF']);
    expect(screen.queryByRole('radio', { name: 'SVG' })).toBeNull();
  });

  it('falls back to an allowed format when the remembered one is not', async () => {
    localStorage.setItem('studio_export', JSON.stringify({ format: 'svg' }));
    const onExport = vi.fn().mockResolvedValue(true);
    open({}, onExport);
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    await vi.waitFor(() => expect(onExport).toHaveBeenCalled());
    expect(onExport.mock.calls[0][0]).toMatchObject({ format: 'png' });
  });
});
