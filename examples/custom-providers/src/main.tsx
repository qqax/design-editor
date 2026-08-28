import { StrictMode } from 'react';

import { DesignEditor } from '@qqax/design-editor';
import { createRoot } from 'react-dom/client';

import type { FontProvider, TemplateProvider } from '@qqax/design-editor';

import '@qqax/design-editor/theme.css';

// ── Demo template provider — serves a single custom template ───
const myTemplateProvider: TemplateProvider = {
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
  async list() {
    return [
      { family: 'Inter', category: 'sans-serif', weights: [400, 600, 700] },
      { family: 'JetBrains Mono', category: 'monospace', weights: [400] },
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

// ── Demo library panel — custom component to inject media ──────────────────────
function MyLibraryPanel({ onAddMedia }: { onAddMedia: (url: string) => void }) {
  return (
    <div
      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>My Library</h3>
      <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
        Host apps can render their own media fetchers and uploader components
        here.
      </p>
      <button
        onClick={() =>
          onAddMedia(
            'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=600&auto=format&fit=crop'
          )
        }
        style={{
          padding: '8px 12px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Add Unsplash Image
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh' }}>
      <DesignEditor
        fontProvider={myFontProvider}
        sceneKey="custom-scene-1"
        templateProvider={myTemplateProvider}
        title="Custom FastlabAI Studio"
        libraryPanel={({ onAddMedia }) => (
          <MyLibraryPanel onAddMedia={onAddMedia} />
        )}
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
