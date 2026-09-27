# @qqax/design-editor

[![npm version](https://img.shields.io/npm/v/@qqax/design-editor.svg)](https://www.npmjs.com/package/@qqax/design-editor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/qqax/design-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/qqax/design-editor/actions/workflows/ci.yml)

An embeddable image design editor for React and Next.js, built for layouts
that end up on screen or in print. Bring your own fonts, media library,
templates and storage through small provider interfaces; restyle and
translate the UI without forking it.

![Design Editor screenshot](https://res.cloudinary.com/ladla8602/image/upload/v1779862509/Design-Editor/design-editor-demo.gif)

## Features

- **Editing** — text, images, shapes, stickers, groups; a layers panel with
  rename, visibility, duplicate and grouping; bring forward / send backward;
  undo / redo; zoom and pan; drag items from the panels onto the page
- **Content** — templates and text designs from your own providers; an
  upload gallery backed by IndexedDB or your server, with a slot for your own
  upload widget
- **Backgrounds** — solid, linear and radial gradients with any number of
  stops, and transparency (shown on a checkerboard, kept in exports)
- **Layout tools** — rulers you can move to any side, guides with snapping,
  page offsets drawn as guides, rounded image corners
- **Print** — page size in px, mm or inches with bleed and a document
  resolution; PDF export with trim box and crop marks
- **Export** — PNG, JPG, WebP, PDF and SVG, at 1–4× scale; download directly
  or hand the file to your app
- **Background removal** in the browser via `@imgly/background-removal`,
  loaded on first use
- **Autosave** of the scene and view through a persistence provider
  (IndexedDB by default)
- **Theming** — dark and light themes, CSS variables, or your own palette and
  fonts through a prop; styles are scoped to the editor root
- **Translations** — every UI text can be replaced; a complete Russian set is
  included
- TypeScript-first; works with the Next.js App Router (`'use client'` is
  built in)

## Install

```bash
npm install @qqax/design-editor
```

React 18 or newer is a peer dependency.

## Quick start

```tsx
import { DesignEditor } from '@qqax/design-editor';
import '@qqax/design-editor/theme.css';

export default function App() {
  return (
    <div style={{ height: '100vh' }}>
      <DesignEditor sceneKey="my-design" />
    </div>
  );
}
```

The editor fills its container, so give the container a height.

### Next.js

The editor draws on `<canvas>`, so load it on the client only:

```tsx
'use client';

import dynamic from 'next/dynamic';

const DesignEditor = dynamic(
  async () => import('@qqax/design-editor').then((m) => m.DesignEditor),
  { ssr: false }
);
```

Import `@qqax/design-editor/theme.css` once, e.g. in the root layout or
`_app.tsx`.

## Props

| Prop | Type | Purpose |
| --- | --- | --- |
| `sceneKey` | `string` | Key the scene is autosaved under |
| `initialScene` | `InitialScene` | Scene to open when there is no autosave; may carry `canvasBg` / `workspaceBg` |
| `onExport` | `(blob, format, scene) => void \| Promise<void>` | "Save to library" in the Export dialog; without it the dialog offers Download only |
| `exportFormats` | `ExportFormat[]` | Formats the Export dialog offers, in order (default: all) |
| `onBack` | `() => void` | Shows an Exit button; warns about unsaved changes |
| `title` | `ReactNode` | Toolbar title |
| `panelsConfig` | object | Per side panel: show or hide, provider, custom render |
| `fontProvider` | `FontProvider` | Fonts for the font picker (default: Google Fonts) |
| `persistenceProvider` | `PersistenceProvider` | Autosave storage (default: IndexedDB) |
| `backgroundRemovalProvider` | `BackgroundRemovalProvider` | Background removal backend (default: in-browser) |
| `adSizes` | `SelectOptions` | Canvas size presets, e.g. `{ label: 'A4', value: '2480x3508@300' }`; `@dpi` sets the resolution (default: screen and print sizes) |
| `theme` | `'dark' \| 'light'` | Initial theme |
| `appearance` | `EditorAppearance` | Your own colours and fonts |
| `messages` | `EditorMessagesOverride` | UI texts |
| `className` | `string` | Class on the editor root |

### Saving to your app

```tsx
<DesignEditor
  sceneKey={design.id}
  initialScene={design.scene}
  exportFormats={['png', 'pdf']}
  onExport={async (blob, format, scene) => {
    await uploadFile(blob, `design.${format}`);
    await saveScene(design.id, scene); // keep the JSON to edit it later
  }}
  onBack={() => router.push('/designs')}
/>
```

A handler typed for fewer formats (for example
`(blob: Blob, format: 'png' | 'pdf') => …`) is accepted; list the same
formats in `exportFormats` so it never receives another.

## Export and print

The Export dialog offers:

- **PNG, WebP** — keep transparency; **JPG** — transparent areas become white
- **Scale** 1–4× for raster output
- **PDF** — the page gets a physical size from the document resolution; the
  image is embedded losslessly (with transparency) or as JPEG. With page
  offsets set, the offsets become the trim box and the rest is bleed;
  crop marks can be added outside it
- **SVG** — vector; fonts are linked from your font provider, images by their
  source URL

For print work, choose **Custom…** in the size menu and enter the trim size
in mm or inches, the bleed and the resolution: the canvas grows by the bleed,
the bleed is marked with offset guides, and PDF export uses the same
resolution. The A4, A5, Letter and business card presets set 300 dpi.

PDFs are RGB raster pages; colour separation (CMYK) and vector text are
outside what the browser can produce.

## Providers

Every provider is optional; the defaults work out of the box.

```ts
import type {
  BackgroundRemovalProvider,
  FontProvider,
  GalleryProvider,
  PersistenceProvider,
  ResourceProvider,
} from '@qqax/design-editor';
```

| Provider | Methods | Default |
| --- | --- | --- |
| `FontProvider` | `list`, `load`, `upload`, `onChange?` | Google Fonts; uploads stay in the page |
| `PersistenceProvider` | `save`, `load`, `list?`, `remove?` | `createIndexedDBPersistence()` |
| `GalleryProvider` | `list`, `upload?`, `remove?`, `subscribe?` | `createLocalGalleryProvider()` (IndexedDB) |
| `ResourceProvider` | `categories`, `list` | Bundled templates and text designs |
| `BackgroundRemovalProvider` | `remove` | `createImglyBackgroundRemoval()` |

Templates, text designs and the gallery are configured per panel:

```tsx
<DesignEditor
  panelsConfig={{
    templates: { provider: myTemplates },
    text: { provider: myTextDesigns },
    stickers: { showPanel: false },
    upload: {
      provider: myGallery,
      // any UI of yours at the top of the Upload panel
      widget: ({ refresh, addToCanvas }) => (
        <MyUploader onUploaded={refresh} onPick={addToCanvas} />
      ),
    },
  }}
/>
```

A panel's `renderProp` replaces the whole panel with your own component.

## Theming

Styles are plain CSS scoped to the editor root (`.de-root`) and driven by
CSS variables, so they do not leak into your app.

The built-in dark and light themes can be switched in Settings. To use your
own palette, pass `appearance` — the theme switcher is then hidden, and you
can drive the colours from your app, e.g. for more than two themes:

```tsx
<DesignEditor
  appearance={{
    colors: { primary: '#ff5a1f', surface: '#101014', text: '#f2f2f2' },
    fonts: { ui: "'Inter', sans-serif" },
  }}
/>
```

Or override the variables in your own CSS:

```css
.de-root {
  --de-color-primary: #ff5a1f;
  --de-radius-md: 2px;
  --de-font-family: 'Inter', sans-serif;
}
```

The full list of variables is at the top of `theme.css`.

## Translations

Pass any subset of the UI texts; everything you leave out stays in English.
Texts with values are functions, so a translation controls word order and
plural forms:

```tsx
import { DesignEditor, ruMessages } from '@qqax/design-editor';

<DesignEditor messages={ruMessages} />;

<DesignEditor
  messages={{
    toolbar: { export: 'Exportieren' },
    panel: { showAll: (count) => `Alle anzeigen (${count})` },
  }}
/>;
```

`defaultMessages` is the complete English set and the reference for all
keys. Names of new layers follow the language too. Texts that come from
providers (template names, categories) are your data and are not translated.

## Several editors on one page

Each editor has its own canvas, fonts, layer names and state, so two
instances can run side by side. Give each a different `sceneKey` so their
autosaves do not overwrite each other.

## Development

The repository is a Bun workspace.

```bash
bun install
bun run build        # builds packages/design-editor
bun run playground   # dev playground on http://localhost:5173
```

Inside `packages/design-editor`: `bun run test`, `bun run typecheck`,
`bun run lint`. The playground switches to Russian with `?lang=ru`.

## Docs and examples

- Documentation — <https://qqax.github.io/design-editor>
- Live playground — <https://qqax.github.io/design-editor/playground>
- Examples — [`examples/`](./examples): Next.js App Router, Pages Router,
  React + Vite, custom providers

## License

[MIT](LICENSE).

This project continues design-editor by [Fastlab](https://fastlab.ai),
whose engine is a fork of [LayerHub](https://github.com/layerhub-io/layerhub-io);
both are MIT licensed. Their notices are kept in [NOTICE](NOTICE) and must
stay with copies of the code.
