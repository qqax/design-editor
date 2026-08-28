import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    coverage: {
      provider: 'v8',
      include: ['src/engine/**', 'src/providers/**'],
      exclude: ['**/__tests__/**', '**/index.ts'],
    },
  },
  resolve: {
    // @imgly/background-removal is an optional peer dependency.
    // Alias it to a virtual empty module so Vite's import-analysis
    // doesn't fail when it's not installed in CI environments.
    alias: {
      '@imgly/background-removal': new URL(
        './src/__mocks__/imglyBackgroundRemoval.ts',
        import.meta.url,
      ).pathname,
    },
  },
})
