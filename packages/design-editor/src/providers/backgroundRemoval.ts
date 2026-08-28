/**
 * Plug in a background-removal backend. The default provider uses the
 * optional `@imgly/background-removal` peer dep to run in-browser; you can
 * supply a server-side provider here instead.
 */
export interface BackgroundRemovalProvider {
  /** Remove the background from the given image and return a transparent-PNG Blob. */
  remove: (
    input: string | Blob,
    opts?: { signal?: AbortSignal; onProgress?: (pct: number) => void }
  ) => Promise<Blob>;
}
