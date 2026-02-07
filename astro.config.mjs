import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: process.env.VERCEL ? vercel() : node({
    mode: 'standalone',
  }),
});
