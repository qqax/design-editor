// Engine — vendored fork of layerhub-io/layerhub-io
// See src/engine/README.md for attribution

// ── types ── (canonical source for shared names: Dimension, LayerType, etc.)
export * from './types';

// ── objects ──
export * from './objects';

// ── react ──
export * from './react';

// ── core ─────────────────────────────────────────────────────────────────────
// Main classes (exported as default from their modules)
export { Editor } from './core/editor';
export { default as Canvas } from './core/canvas';
export { default as EditorState } from './core/state';
export { default as EventManager } from './core/event-manager';

// constants — omit LayerType (comes from ./types)
export {
  commonParams,
  copyStyleProps,
  defaultBackgroundOptions,
  defaultEditorConfig,
  defaultFrameOptions,
  getCopyStyleCursor,
  PROPERTIES_TO_INCLUDE,
} from './core/common/constants';

// interfaces — omit Dimension (comes from ./types)
export type {
  CanvasBackground,
  CanvasOptions,
  ControllerOptions,
  Direction,
  EditorState as IEditorState,
  FabricCanvas,
  FabricCanvasOption,
  FabricWheelEvent,
  GradientFill,
  GradientOptions,
  GradientStop,
  ScaleType,
  ShadowOptions,
  Size,
  Template,
} from './core/common/interfaces';

// event-manager types
export type {
  Emitter,
  EventHandlerList,
  EventHandlerMap,
  EventType,
  Handler,
  WildCardEventHandlerList,
  WildcardHandler,
} from './core/event-manager';

// controllers
export * from './core/controllers/Base';
export * from './core/controllers/History';
export * from './core/controllers/objects';
export * from './core/controllers/Scene';
export * from './core/controllers/Frame';
export * from './core/controllers/Events';
export * from './core/controllers/Guidelines';
export * from './core/controllers/Zoom';
export * from './core/controllers/Personalization';
export * from './core/controllers/Renderer';

// parser
export * from './core/parser';

// export
export * from './core/export';

// utils
export * from './core/utils/font-loader';
export { gradientToCss, isGradientFill } from './core/utils/gradient';
export {
  NO_OFFSETS,
  OFFSET_GUIDE_PREFIX,
  offsetGuides,
  snapOffset,
} from './core/utils/guides';
export type {
  Guide,
  GuideAxis,
  GuideRect,
  PageOffsets,
} from './core/utils/guides';
export * from './core/utils/image-loader';
export * from './core/utils/object-exporter';
export * from './core/utils/object-importer';
export * from './core/utils/text';
export {
  createLayerName,
  DEFAULT_LAYER_LABELS,
  resolveLayerLabels,
} from './core/utils/layer-name';
export type { LayerLabels } from './core/utils/layer-name';
export * from './core/utils/get-selection-type';
