# Examples

Minimal apps demonstrating `@qqax/design-editor` in different setups.

| Example | Stack | Purpose |
| --- | --- | --- |
| [`nextjs-app-router/`](./nextjs-app-router) | Next.js 15 + App Router | Server-component layout, client-component editor. |
| [`nextjs-pages-router/`](./nextjs-pages-router) | Next.js 15 + Pages Router | `dynamic()` import with `ssr: false`. |
| [`vite-react/`](./vite-react) | Vite + React 18 | Plain React + Vite minimal setup. |
| [`custom-providers/`](./custom-providers) | Vite + React 18 | Own templates (`ResourceProvider`), fonts (`FontProvider`) and an external gallery with an upload widget. |

Run any example from the repo root:

```bash
bun run build   # the examples use the local package build
bun --filter example-vite-react dev
bun --filter example-nextjs-app-router dev
bun --filter example-nextjs-pages-router dev
bun --filter example-custom-providers dev
```
