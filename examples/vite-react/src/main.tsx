import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { DesignEditor } from '@qqax/design-editor';
import '@qqax/design-editor/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh' }}>
      <DesignEditor
        sceneKey="example-scene-1"
        title="Design Studio"
        onExport={async (blob, format) => {
          console.log(`Exported ${format} file: ${blob.size} bytes`);
          alert(`Exported ${format} file: ${blob.size} bytes`);
        }}
      />
    </div>
  </StrictMode>
);
