import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { DesignEditor } from '@fastlabai/design-editor';
import '@fastlabai/design-editor/theme.css';

function download(data: Blob | string, filename: string) {
  const blob =
    typeof data === 'string'
      ? new Blob([data], { type: 'application/json' })
      : data;
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh' }}>
      <DesignEditor
        onExport={(blob, format, scene) => {
          const id = Date.now();
          download(blob, `design-${id}.${format}`);
          download(JSON.stringify(scene, null, 2), `design-${id}.json`);
        }}
      />
    </div>
  </StrictMode>
);
