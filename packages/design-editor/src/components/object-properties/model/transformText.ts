import type { TextTransform } from './types';

export function transformText(text: string, transform: TextTransform): string {
  switch (transform) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(
        /\w\S*/g,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
    case 'none':
      return text;
  }
}
