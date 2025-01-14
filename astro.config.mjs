// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// import vercel from '@astrojs/vercel/serverless';

import node from '@astrojs/node';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),
});