// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import type { DesignEditorProps } from '../types';

describe('DesignEditorProps', () => {
  it('accepts an onExport handler typed for fewer formats', () => {
    const received: string[] = [];
    const handler = (_blob: Blob, format: 'png' | 'jpg' | 'svg') => {
      received.push(format);
    };
    const props: DesignEditorProps = {
      onExport: handler,
      exportFormats: ['png', 'jpg', 'svg'],
    };
    expect(props.onExport).toBe(handler);
  });
});
