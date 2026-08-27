import type { FontChangeHandler, FontDescriptor, FontProvider } from '../fonts';

const GOOGLE_FONT_FAMILIES: string[] = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Source Sans Pro',
  'Raleway',
  'PT Sans',
  'Merriweather',
  'Nunito',
  'Playfair Display',
  'Ubuntu',
  'Poppins',
  'Muli',
  'PT Serif',
  'Josefin Sans',
  'Fira Sans',
  'Noto Sans',
  'Dosis',
  'Quicksand',
  'Cabin',
  'Varela Round',
  'Lobster',
  'Pacifico',
  'Dancing Script',
  'Comfortaa',
  'Righteous',
  'Satisfy',
  'Abril Fatface',
  'Bebas Neue',
  'Anton',
  'Permanent Marker',
];

const GOOGLE_DESCRIPTORS: FontDescriptor[] = GOOGLE_FONT_FAMILIES.map(
  (family) => ({
    family,
    source: 'google' as const,
  })
);

/**
 * Derives a display family name from a font filename.
 * e.g. "My-Cool_Font.ttf" → "My Cool Font"
 */
function familyFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '');
  const spaced = base.replace(/[-_]/g, ' ');
  // Title-case each word
  return spaced.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}

/**
 * Default font provider: 30+ Google Font families + custom uploaded fonts.
 * Each factory call returns an independent provider instance with its own state.
 */
export function createDefaultFontProvider(): FontProvider {
  const loadedFamilies = new Set<string>();
  const uploads = new Map<string, FontDescriptor>();
  const subscribers = new Set<FontChangeHandler>();

  function notify() {
    subscribers.forEach((h) => h());
  }

  function loadGoogleFont(family: string): void {
    if (loadedFamilies.has(family)) return;
    loadedFamilies.add(family);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
    document.head.appendChild(link);
  }

  return {
    async list(): Promise<FontDescriptor[]> {
      return [...GOOGLE_DESCRIPTORS, ...uploads.values()];
    },

    async load(family: string): Promise<void> {
      // If it's an uploaded font, FontFace is already registered — no-op.
      if (uploads.has(family)) return;
      loadGoogleFont(family);
    },

    async upload(file: File): Promise<FontDescriptor> {
      const family = familyFromFilename(file.name);
      const buffer = await file.arrayBuffer();
      const face = new FontFace(family, buffer);
      document.fonts.add(face);
      await face.load();

      const descriptor: FontDescriptor = {
        family,
        source: 'custom',
      };
      uploads.set(family, descriptor);
      notify();
      return descriptor;
    },

    onChange(handler: FontChangeHandler): () => void {
      subscribers.add(handler);
      return () => subscribers.delete(handler);
    },
  };
}
