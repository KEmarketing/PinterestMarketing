import { SITE } from '../site.config.mjs';

/* Written from SITE.url so it always points at the right sitemap.
   Every crawler is welcome, search engines and AI answer engines alike. */
export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', SITE.url).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
