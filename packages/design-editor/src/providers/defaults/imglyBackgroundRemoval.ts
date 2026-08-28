import type { BackgroundRemovalProvider } from '../backgroundRemoval';

export function createImglyBackgroundRemoval(): BackgroundRemovalProvider {
  return {
    async remove(input, opts) {
      let removeBackground: typeof import('@imgly/background-removal').removeBackground;
      try {
        const mod = await import('@imgly/background-removal');
        removeBackground = mod.removeBackground;
      } catch (e) {
        console.error(e);
        throw new Error(
          'Failed to load @imgly/background-removal module. Please check your build configuration.'
        );
      }
      return removeBackground(input, {
        publicPath:
          'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
        progress: opts?.onProgress
          ? (_key: string, current: number, total: number) =>
              opts.onProgress!(current / total)
          : undefined,
      });
    },
  };
}
