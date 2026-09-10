export type StickerCategoryType =
  | '3Dstickers'
  | 'craft'
  | 'doodle'
  | 'emoji'
  | 'emoticons'
  | 'florals'
  | 'hand';

export interface StickerDef {
  id: string;
  label: string;
  category: StickerCategoryType;
  file: string;
}
