import React from 'react';

import { Context } from '../context';
import type { FabricObject } from 'fabric';

export function useActiveObject<T = FabricObject>() {
  const { activeObject } = React.useContext(Context);

  return activeObject as unknown as T;
}
