import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json'
    })
  ],
  define: {
    'import.meta': '{}'
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'fabric',
        '@radix-ui/react-dialog',
        '@radix-ui/react-popover',
        '@radix-ui/react-select',
        '@radix-ui/react-slider',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tooltip'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          fabric: 'fabric'
        }
      }
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
