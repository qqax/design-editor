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

const DEFAULT_LABELS: LayerLabels = {
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

let labels: LayerLabels = DEFAULT_LABELS;

/** Localizes the names given to new layers ("Text 1" → "Текст 1") */
export function setLayerLabels(next: Partial<LayerLabels> | null): void {
  labels = { ...DEFAULT_LABELS, ...next };
}

/** Type names and labels in any language set so far are all "generic" */
const genericNames = new Set(
  [...Object.keys(LABEL_BY_TYPE), ...Object.values(LayerType)].map((name) =>
    name.toLowerCase()
  )
);

const isGenericName = (name: string) => {
  const lower = name.toLowerCase();
  return (
    genericNames.has(lower) ||
    Object.values(DEFAULT_LABELS).some((l) => l.toLowerCase() === lower) ||
    Object.values(labels).some((l) => l.toLowerCase() === lower)
  );
};

export function getLayerLabel(type: string | undefined): string {
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
  taken: ReadonlySet<string>
): string {
  const trimmed = name?.trim() ?? '';
  const isGeneric = !trimmed || isGenericName(trimmed);

  if (!isGeneric && !taken.has(trimmed)) return trimmed;

  const base = isGeneric
    ? getLayerLabel(type)
    : trimmed.replace(/\s+\d+$/, '') || getLayerLabel(type);

  let ordinal = 1;
  while (taken.has(`${base} ${ordinal}`)) ordinal += 1;
  return `${base} ${ordinal}`;
}
