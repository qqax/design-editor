import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: !options.watch,
  treeshake: true,
  splitting: false,

  external: [
    'react',
    'react-dom',
    '@imgly/background-removal',
    'antd',
    '@ant-design/icons',
  ],

  noExternal: [
    /@radix-ui\/.*/,
    'lucide-react',
    'clsx',
  ],

  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
}))
