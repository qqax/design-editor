// Created by Claude (Claude Code).
import { describe, expect, it } from 'vitest';

import { transformText } from '../transformText';

describe('transformText', () => {
  it('changes the case of the text', () => {
    expect(transformText('Hello wORLD', 'upper')).toBe('HELLO WORLD');
    expect(transformText('Hello wORLD', 'lower')).toBe('hello world');
    expect(transformText('hello wORLD again', 'title')).toBe(
      'Hello World Again'
    );
    expect(transformText('Hello wORLD', 'none')).toBe('Hello wORLD');
  });
});
