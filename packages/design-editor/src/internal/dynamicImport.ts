// The specifier is passed through a Function-constructed wrapper so
// bundlers (Rollup/Vite/esbuild) cannot statically analyse it. This is
// required for optional peer dependencies: if a consumer's bundler sees a
// literal `import('@imgly/background-removal')` inside our published
// dist/index.js, it tries to resolve the package at build time and fails
// when the optional peer is not installed. Hiding the specifier behind
// `new Function` defeats every static analyser because the body is a string.
const dynamicImport = new Function('specifier', 'return import(specifier)') as <
  T,
>(
  specifier: string
) => Promise<T>;

export async function importOptionalPeer<T = unknown>(
  specifier: string
): Promise<T> {
  return dynamicImport<T>(specifier);
}
