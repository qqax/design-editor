'use client';

import dynamic from 'next/dynamic';

const DesignEditor = dynamic(
  async () =>
    import('@qqax/design-editor').then((mod) => mod.DesignEditor),
  { ssr: false }
);

export default function Home() {
  return (
    <main style={{ height: '100vh' }}>
      <DesignEditor
        sceneKey="nextjs-app-scene-1"
        title="Design Studio (App Router)"
        onExport={async (blob, format) => {
          console.log(`Exported ${format} file: ${blob.size} bytes`);
          alert(`Exported ${format} file: ${blob.size} bytes`);
        }}
      />
    </main>
  );
}
