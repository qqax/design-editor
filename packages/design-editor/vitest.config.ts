import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/engine/**', 'src/providers/**'],
      exclude: ['**/__tests__/**', '**/index.ts', 'src/test/**'],
    },
  },
});
