import dynamic from 'next/dynamic';

// The editor manipulates <canvas> and browser APIs, so disable SSR.
const DesignEditor = dynamic(
  async () => import('@qqax/design-editor').then((m) => m.DesignEditor),
  { ssr: false }
);

export default function Home() {
  return (
    <main style={{ height: '100vh' }}>
      <DesignEditor
        sceneKey="nextjs-pages-scene-1"
        title="Design Studio (Pages Router)"
        onExport={async (blob, format) => {
          console.log(`Exported ${format} file: ${blob.size} bytes`);
          alert(`Exported ${format} file: ${blob.size} bytes`);
        }}
      />
    </main>
  );
}
