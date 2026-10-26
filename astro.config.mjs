import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.mjs';

export default defineConfig({
  site: SITE.url,
  // The guide page is just for Kandace, so it stays out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/guide') })],
  build: { inlineStylesheets: 'auto' },
});
