export type ShapeCategoryType =
  | 'filled'
  | 'outline'
  | 'gradient'
  | 'image'
  | 'abstract'
  | 'abstract_outline'
  | 'abstract_gradient'
  | 'abstract_image';

export interface ShapeDef {
  id: string;
  label: string;
  category: ShapeCategoryType;
  file: string;
}
