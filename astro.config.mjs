import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.mjs';
import securityHeaders from './src/security-headers.mjs';

export default defineConfig({
  site: SITE.url,
  // The guide page is just for Kandace, so it stays out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/guide') }), securityHeaders()],
  build: { inlineStylesheets: 'auto' },
});
