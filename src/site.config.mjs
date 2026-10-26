/* ---------------------------------------------------------------
   The only file you need to touch when the domain is confirmed.
   Change SITE.url and everything downstream follows: canonical
   tags, sitemap.xml, robots.txt, llms.txt, the share image links
   and the structured data.

   Everything points at her real domain, kandaceemory.com. The
   pages.dev address is only a temporary preview.
   --------------------------------------------------------------- */
/* Her booking link, email, Facebook page and the small labels around
   the page live in src/data/site.json, which she edits in the CMS under
   Site settings. */
import settings from './data/site.json' with { type: 'json' };

export const SITE = {
  url: 'https://kandaceemory.com',
  /* her business name, from Site settings */
  name: String(settings.name ?? '').trim() || 'Kandace Emory Pinterest Marketing',
  /* her logos and browser-tab icon, from Site settings */
  logo: settings.logo || '/images/logo-top.webp',
  logoFooter: settings.logoFooter || '/images/logo-footer.webp',
  icon: settings.icon || '/favicon.svg',
  shortName: 'Kandace Emory',
  email: settings.email,
  facebook: settings.facebook,
  booking: settings.booking,
  region: 'FL',
  country: 'US',
  nav: settings.nav,
  labels: { ...settings.labels, menu: String(settings.labels?.menu ?? '').trim() || 'Menu' },
  footerNote: settings.footerNote,
  /* the picture shown when the link is shared (texts, Facebook, LinkedIn) */
  shareImage: settings.shareImage || '/images/share.jpg',
  /* her profiles elsewhere, so search engines and AI tools know they are her */
  profiles: [settings.facebook, settings.pinterest, ...(settings.otherProfiles ?? [])]
    .map((u) => String(u ?? '').trim()).filter(Boolean),
  /* ownership codes from Google Search Console, Bing Webmaster Tools and
     Pinterest. She can paste the whole tag or just the code. */
  verification: Object.fromEntries(
    Object.entries(settings.verification ?? {}).map(([k, v]) => {
      const raw = String(v ?? '').trim();
      const m = raw.match(/content=["']([^"']+)["']/);
      return [k, (m ? m[1] : raw).trim()];
    }),
  ),
  shareImageAlt: 'Kandace Emory Pinterest Marketing: moving your audience from inspiration to action',
};
