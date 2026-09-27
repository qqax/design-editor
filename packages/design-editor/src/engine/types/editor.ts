import type { Dimension, RotationControlPosition } from './common';

type SceneType = 'CUSTOMIZATION' | 'GRAPHIC' | 'PRESENTATION' | 'VIDEO';

export interface SettingsType {
  showGrid: boolean;
  snapGrid: boolean;
  showRulers: boolean;
  snapToGuides: boolean;
  /** Edges the rulers are attached to */
  rulerSides: { horizontal: 'top' | 'bottom'; vertical: 'left' | 'right' };
  /** Edges the rulers count from */
  rulerOrigin: { x: 'left' | 'right'; y: 'top' | 'bottom' };
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
