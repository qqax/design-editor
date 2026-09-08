import { useEffect, useState } from 'react';

interface UseImageControlsOptions {
  activeObj: any;
}

export const useImageControls = ({ activeObj }: UseImageControlsOptions) => {
  const [borderRadius, setBorderRadius] = useState<number>(
    () => (activeObj?.rx as number | undefined) ?? 0,
  );
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(
    () => !!activeObj?.shadow,
  );

  useEffect(() => {
    setBorderRadius((activeObj?.rx as number | undefined) ?? 0);
    setShadowEnabled(!!activeObj?.shadow);
  }, [activeObj?.id]);

  return {
    borderRadius,
    setBorderRadius,
    shadowEnabled,
    setShadowEnabled,
  }
};
