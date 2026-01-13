import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  build: {
    format: 'directory',
    assets: '_astro',
  },
  vite: {
    ssr: {
      noExternal: ['framer-motion'],
    },
    build: {
      assetsInlineLimit: 0,
    },
  },
});
