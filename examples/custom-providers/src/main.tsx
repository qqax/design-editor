import { StrictMode, useState } from 'react';

import { DesignEditor } from '@qqax/design-editor';
import { createRoot } from 'react-dom/client';

import type {
  FontDescriptor,
  FontProvider,
  GalleryItem,
  GalleryProvider,
  GalleryWidgetApi,
  ResourceProvider,
} from '@qqax/design-editor';

// eslint-disable-next-line import-x/order
import '@qqax/design-editor/theme.css';

// ── Demo template provider — serves a single custom template ───
const myTemplateProvider: ResourceProvider = {
  async categories() {
    return [{ id: 'custom-cat', name: 'Custom Templates', order: 1 }];
  },
  async list({ search = '' } = { search: '' }) {
    const q = search.toLowerCase();
    const templates = [
      {
        id: 'tpl-001',
        name: 'My Custom Template',
        categoryId: 'custom-cat',
        scene: {
          id: 'scene-001',
          frame: { width: 800, height: 600 },
          layers: [],
          metadata: {},
        },
      },
    ];
    return {
      items: templates.filter((t) => t.name.toLowerCase().includes(q)),
    };
  },
};

// ── Demo font provider — single custom font ─────────────────────────────────
const myFontProvider: FontProvider = {
  async upload(file: File): Promise<FontDescriptor> {
    return Promise.resolve({
      family: 'Inter',
      category: 'sans-serif',
      weights: [400, 600, 700],
      source: 'custom',
    });
  },
  async list() {
    return [
      {
        family: 'Inter',
        category: 'sans-serif',
        weights: [400, 600, 700],
        source: 'custom',
      },
      {
        family: 'JetBrains Mono',
        category: 'monospace',
        weights: [400],
        source: 'custom',
      },
    ];
  },
  async load(family) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;600;700&display=swap`;
    document.head.appendChild(link);
    await document.fonts.ready;
  },
};

// ── Demo external gallery — stands in for a server-side media library ────────
const serverImages: GalleryItem[] = [
  {
    id: 'img-1',
    name: 'Mountains',
    url: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=60&w=300&auto=format&fit=crop',
  },
];

const myGalleryProvider: GalleryProvider = {
  async list() {
    return [...serverImages];
  },
  async remove(id) {
    const index = serverImages.findIndex((item) => item.id === id);
    if (index >= 0) serverImages.splice(index, 1);
  },
};

// ── Demo gallery widget — any host UI that adds images to the gallery ────────
function AddByUrlWidget({ refresh, addToCanvas }: GalleryWidgetApi) {
  const [url, setUrl] = useState('');
  const add = () => {
    if (!url) return;
    serverImages.unshift({ id: `img-${Date.now()}`, url, name: 'From URL' });
    setUrl('');
    refresh();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <input
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Image URL"
        style={{ padding: 6 }}
        value={url}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={add} type="button">
          Add to gallery
        </button>
        <button disabled={!url} onClick={() => addToCanvas(url)} type="button">
          Put on canvas
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh' }}>
      <DesignEditor
        fontProvider={myFontProvider}
        sceneKey="custom-scene-1"
        title="Custom Design Studio"
        panelsConfig={{
          templates: { provider: myTemplateProvider },
          upload: {
            provider: myGalleryProvider,
            widget: (api) => <AddByUrlWidget {...api} />,
          },
        }}
        onExport={async (blob, format, scene) => {
          console.log('Export triggered!', { size: blob.size, format, scene });
          alert(
            `Exported a ${format} file of ${Math.round(blob.size / 1024)} KB! Check console for scene JSON.`
          );
        }}
      />
    </div>
  </StrictMode>
);
