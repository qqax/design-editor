# Examples

Minimal apps demonstrating `@qqax/design-editor` in different setups.

| Example | Stack | Purpose |
| --- | --- | --- |
| [`nextjs-app-router/`](./nextjs-app-router) | Next.js 15 + App Router | Server-component layout, client-component editor. |
| [`nextjs-pages-router/`](./nextjs-pages-router) | Next.js 15 + Pages Router | `dynamic()` import with `ssr: false`. |
| [`vite-react/`](./vite-react) | Vite + React 18 | Plain React + Vite minimal setup. |
| [`custom-providers/`](./custom-providers) | Vite + React 18 | Hand-rolled `TemplateProvider` and `FontProvider`. |

Run any example from the repo root:

```bash
pnpm --filter example-vite-react dev
pnpm --filter example-nextjs-app-router dev
pnpm --filter example-nextjs-pages-router dev
pnpm --filter example-custom-providers dev
```
