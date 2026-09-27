import { useState } from 'react';

import type { FabricObject } from 'fabric';

interface UseImageControlsOptions {
  activeObj: FabricObject | null | undefined;
}

const cornerRadius = (object: FabricObject | null | undefined): number => {
  const radius: unknown = object ? object.get('cornerRadius') : undefined;
  return typeof radius === 'number' ? radius : 0;
};

export const useImageControls = ({ activeObj }: UseImageControlsOptions) => {
  const [borderRadius, setBorderRadius] = useState(() =>
    cornerRadius(activeObj)
  );
  const [shadowEnabled, setShadowEnabled] = useState(() => !!activeObj?.shadow);

  const [prevObj, setPrevObj] = useState(activeObj);
  if (activeObj !== prevObj) {
    setPrevObj(activeObj);
    setBorderRadius(cornerRadius(activeObj));
    setShadowEnabled(!!activeObj?.shadow);
  }

  return {
    borderRadius,
    setBorderRadius,
    shadowEnabled,
    setShadowEnabled,
  };
};
