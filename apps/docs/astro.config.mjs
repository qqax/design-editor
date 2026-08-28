import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://qqax.github.io',
  base: '/design-editor',

  vite: {
    ssr: {
      noExternal: ['nanoid'],
    },
  },

  integrations: [
    starlight({
      title: '@qqax/design-editor',
      customCss: ['./src/styles/custom.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/qqax/design-editor',
        },
      ],
      sidebar: [
        { label: 'Getting Started', link: '/getting-started' },
        { label: 'React.js', link: '/react' },
        { label: 'Next.js', link: '/nextjs' },
        {
          label: 'Providers',
          items: [
            { label: 'Media', link: '/providers/media' },
            { label: 'Fonts', link: '/providers/fonts' },
            {
              label: 'Background Removal',
              link: '/providers/background-removal',
            },
            { label: 'Persistence', link: '/providers/persistence' },
          ],
        },
        { label: 'API Reference', link: '/api' },
      ],
    }),
  ],
});
