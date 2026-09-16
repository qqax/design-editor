import type { Dimension, RotationControlPosition } from './common';

type SceneType = 'CUSTOMIZATION' | 'GRAPHIC' | 'PRESENTATION' | 'VIDEO';

export interface SettingsType {
  showGrid: boolean;
  snapGrid: boolean;
  railSide: 'left' | 'right';
}

export interface EditorConfig extends SettingsType {
  id: string;
  clipToFrame: boolean;
  scrollLimit: number;
  propertiesToInclude?: string[];
  shortcuts?: boolean;
  guidelines?: boolean;
  shadow: any;
  frameMargin: number;
  background: string;
  size: Dimension;
  controlsPosition: ControlsPosition;
  type: SceneType;
}

export interface ControlsPosition {
  rotation: RotationControlPosition;
}
