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
  const loads = new Map<string, Promise<void>>();
  const uploads = new Map<string, FontDescriptor>();
  const subscribers = new Set<FontChangeHandler>();

  function notify() {
    subscribers.forEach((h) => h());
  }

  /**
   * Resolves only once the face is actually usable — appending the stylesheet
   * is not enough, since callers render text on the very next tick.
   */
  async function loadGoogleFont(family: string): Promise<void> {
    const pending = loads.get(family);
    if (pending) return pending;

    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family
    ).replace(/%20/g, '+')}&display=swap`;

    const promise = new Promise<void>((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.addEventListener('load', () => resolve());
      link.addEventListener('error', () => resolve());
      document.head.appendChild(link);
    }).then(async () => {
      await document.fonts.load(`1em "${family}"`);
    });

    loads.set(family, promise);
    return promise;
  }

  return {
    async list(): Promise<FontDescriptor[]> {
      return [...GOOGLE_DESCRIPTORS, ...uploads.values()];
    },

    async load(family: string): Promise<void> {
      // If it's an uploaded font, FontFace is already registered — no-op.
      if (uploads.has(family)) return;
      await loadGoogleFont(family);
    },

    async upload(file: File): Promise<FontDescriptor> {
      const family = familyFromFilename(file.name);
      const buffer = await file.arrayBuffer();
      const face = await new FontFace(family, buffer).load();
      document.fonts.add(face);

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
