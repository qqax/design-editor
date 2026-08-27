/**
 * Type stub for the optional peer dependency @imgly/background-removal.
 * This allows tsc to resolve the `typeof import('@imgly/background-removal').removeBackground`
 * reference in imglyBackgroundRemoval.ts without requiring the package to be installed.
 */
declare module '@imgly/background-removal' {
  export type ImageSource = string | URL | ArrayBuffer | Blob | File;

  export interface Config {
    progress?: (key: string, current: number, total: number) => void;
    [key: string]: unknown;
  }

  export function removeBackground(
    image: ImageSource,
    config?: Config
  ): Promise<Blob>;
}
