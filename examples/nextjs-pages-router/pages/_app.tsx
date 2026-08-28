import type { AppProps } from 'next/app';

import '@qqax/design-editor/theme.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
