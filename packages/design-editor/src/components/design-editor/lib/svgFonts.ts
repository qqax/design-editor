import type { FontDescriptor } from '../../../providers';

export const googleFontCssUrl = (family: string) =>
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  ).replace(/%20/g, '+')}&display=swap`;

const cssString = (value: string) => `"${value.replace(/["\\]/g, '\\$&')}"`;

/**
 * CSS that makes an exported SVG load its fonts: Google families via
 * `@import`, custom ones with a URL via `@font-face`. Families the provider
 * does not describe are left to the viewer's system fonts.
 */
export function svgFontCss(
  families: readonly string[],
  descriptors: readonly FontDescriptor[]
): string {
  const byFamily = new Map(descriptors.map((d) => [d.family, d]));
  const imports: string[] = [];
  const faces: string[] = [];
  new Set(families).forEach((family) => {
    const descriptor = byFamily.get(family);
    if (descriptor?.url) {
      faces.push(
        `@font-face { font-family: ${cssString(family)}; src: url(${cssString(descriptor.url)}); }`
      );
    } else if (descriptor?.source === 'google') {
      imports.push(`@import url(${cssString(googleFontCssUrl(family))});`);
    }
  });
  return [...imports, ...faces].join('\n');
}
