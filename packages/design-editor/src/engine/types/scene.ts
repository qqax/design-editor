import type { TimeRange } from './common';
import type { ILayer } from './layers';

export interface IFrame {
  width: number;
  height: number;
}

export interface IScene {
  id: string;
  frame: IFrame;
  name?: string;
  description?: string;
  layers: Partial<ILayer>[];
  metadata: Record<string, any>;
  preview?: string;
  duration?: number;
  display?: TimeRange;
}
