import { LayerType } from '../../types';

const LABELS: Record<string, string> = {
  [LayerType.STATIC_TEXT]: 'Text',
  [LayerType.DYNAMIC_TEXT]: 'Text',
  [LayerType.STATIC_IMAGE]: 'Image',
  [LayerType.DYNAMIC_IMAGE]: 'Image',
  [LayerType.BACKGROUND_IMAGE]: 'Background image',
  [LayerType.STATIC_VIDEO]: 'Video',
  [LayerType.STATIC_AUDIO]: 'Audio',
  [LayerType.STATIC_PATH]: 'Shape',
  [LayerType.DYNAMIC_PATH]: 'Shape',
  [LayerType.STATIC_VECTOR]: 'Vector',
  [LayerType.STATIC_GROUP]: 'Group',
  [LayerType.DYNAMIC_GROUP]: 'Group',
  [LayerType.GROUP]: 'Group',
  [LayerType.BACKGROUND]: 'Background',
};

const GENERIC_NAMES = new Set(
  [...Object.keys(LABELS), ...Object.values(LayerType)].map((name) =>
    name.toLowerCase()
  )
);

export function getLayerLabel(type: string | undefined): string {
  return (type && LABELS[type]) ?? 'Layer';
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
  const isGeneric = !trimmed || GENERIC_NAMES.has(trimmed.toLowerCase());

  if (!isGeneric && !taken.has(trimmed)) return trimmed;

  const base = isGeneric
    ? getLayerLabel(type)
    : trimmed.replace(/\s+\d+$/, '') || getLayerLabel(type);

  let ordinal = 1;
  while (taken.has(`${base} ${ordinal}`)) ordinal += 1;
  return `${base} ${ordinal}`;
}
