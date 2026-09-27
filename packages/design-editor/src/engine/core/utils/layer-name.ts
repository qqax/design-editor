import { LayerType } from '../../types';

export interface LayerLabels {
  text: string;
  image: string;
  backgroundImage: string;
  video: string;
  audio: string;
  shape: string;
  vector: string;
  group: string;
  background: string;
  layer: string;
}

export const DEFAULT_LAYER_LABELS: LayerLabels = {
  text: 'Text',
  image: 'Image',
  backgroundImage: 'Background image',
  video: 'Video',
  audio: 'Audio',
  shape: 'Shape',
  vector: 'Vector',
  group: 'Group',
  background: 'Background',
  layer: 'Layer',
};

const LABEL_BY_TYPE: Record<string, keyof LayerLabels> = {
  [LayerType.STATIC_TEXT]: 'text',
  [LayerType.DYNAMIC_TEXT]: 'text',
  [LayerType.STATIC_IMAGE]: 'image',
  [LayerType.DYNAMIC_IMAGE]: 'image',
  [LayerType.BACKGROUND_IMAGE]: 'backgroundImage',
  [LayerType.STATIC_VIDEO]: 'video',
  [LayerType.STATIC_AUDIO]: 'audio',
  [LayerType.STATIC_PATH]: 'shape',
  [LayerType.DYNAMIC_PATH]: 'shape',
  [LayerType.STATIC_VECTOR]: 'vector',
  [LayerType.STATIC_GROUP]: 'group',
  [LayerType.DYNAMIC_GROUP]: 'group',
  [LayerType.GROUP]: 'group',
  [LayerType.BACKGROUND]: 'background',
};

/** Fills gaps with English and drops keys that are not layer labels */
export function resolveLayerLabels(
  partial: Partial<LayerLabels> | null | undefined
): LayerLabels {
  const known = Object.keys(DEFAULT_LAYER_LABELS) as (keyof LayerLabels)[];
  return Object.fromEntries(
    known.map((key) => [key, partial?.[key] || DEFAULT_LAYER_LABELS[key]])
  ) as unknown as LayerLabels;
}

const TYPE_NAMES = new Set(
  [...Object.keys(LABEL_BY_TYPE), ...Object.values(LayerType)].map((name) =>
    name.toLowerCase()
  )
);

/** Type names and labels in English or the current language are "generic" */
function isGenericName(name: string, labels: LayerLabels): boolean {
  const lower = name.toLowerCase();
  const matches = (set: LayerLabels) =>
    Object.values(set).some((label) => label.toLowerCase() === lower);
  return (
    TYPE_NAMES.has(lower) || matches(DEFAULT_LAYER_LABELS) || matches(labels)
  );
}

export function getLayerLabel(
  type: string | undefined,
  labels: LayerLabels = DEFAULT_LAYER_LABELS
): string {
  const key = type ? LABEL_BY_TYPE[type] : undefined;
  return labels[key ?? 'layer'];
}

/**
 * Returns `name` when it is meaningful and not yet used, otherwise the layer
 * label (or `name` without its trailing number) followed by the lowest free
 * ordinal: "Text 1", "Text 2", …
 */
export function createLayerName(
  type: string | undefined,
  name: string | undefined,
  taken: ReadonlySet<string>,
  labels: LayerLabels = DEFAULT_LAYER_LABELS
): string {
  const trimmed = name?.trim() ?? '';
  const isGeneric = !trimmed || isGenericName(trimmed, labels);

  if (!isGeneric && !taken.has(trimmed)) return trimmed;

  const base = isGeneric
    ? getLayerLabel(type, labels)
    : trimmed.replace(/\s+\d+$/, '') || getLayerLabel(type, labels);

  let ordinal = 1;
  while (taken.has(`${base} ${ordinal}`)) ordinal += 1;
  return `${base} ${ordinal}`;
}
