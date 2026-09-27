// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { en } from '../en';
import { mergeMessages } from '../merge';
import { ru } from '../ru';

const shape = (value: unknown): unknown =>
  typeof value === 'object' && value !== null
    ? Object.fromEntries(
        Object.entries(value).map(([key, inner]) => [key, shape(inner)])
      )
    : typeof value;

describe('mergeMessages', () => {
  it('returns the base without an override', () => {
    expect(mergeMessages(en, undefined)).toBe(en);
  });

  it('overrides nested texts and keeps the rest', () => {
    const merged = mergeMessages(en, {
      toolbar: { export: 'Экспорт' },
      panel: { showAll: (count: number) => `Все: ${count}` },
    });
    expect(merged.toolbar.export).toBe('Экспорт');
    expect(merged.toolbar.undo).toBe('Undo');
    expect(merged.panel.showAll(3)).toBe('Все: 3');
    expect(merged.layers).toBe(en.layers);
  });

  it('ignores values of the wrong kind', () => {
    const merged = mergeMessages(en, {
      panel: { showAll: 'broken' as unknown as () => string },
    });
    expect(merged.panel.showAll(2)).toBe('Show all (2)');
  });
});

describe('ru', () => {
  it('translates every text with the same structure as English', () => {
    expect(shape(ru)).toEqual(shape(en));
  });
});
