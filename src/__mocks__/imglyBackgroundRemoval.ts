/**
 * Stub for the optional peer dependency @imgly/background-removal.
 *
 * This file is used by vitest.config.ts resolve.alias so Vite's import-analysis
 * does not fail when @imgly/background-removal is not installed (e.g. in CI).
 * The actual dynamic import in imglyBackgroundRemoval.ts is wrapped in try/catch
 * so this stub is never called at runtime when the real package is absent.
 */
export async function removeBackground(): Promise<Blob> {
  throw new Error(
    '@imgly/background-removal is not installed. Install it as a peer dependency.'
  );
}
