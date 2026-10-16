/* ---------------------------------------------------------------
   The only file you need to touch when the domain is confirmed.
   Change SITE.url and everything downstream follows: canonical
   tags, sitemap.xml, robots.txt, llms.txt, the share image links
   and the structured data.

   For now the site lives at its pages.dev address, so that is the
   address search engines are told is the real one. On launch day,
   when kandaceemory.com points at this site, change url to
   'https://kandaceemory.com' and push.
   --------------------------------------------------------------- */
export const SITE = {
  url: 'https://pinterestmarketing.pages.dev',   // <-- becomes https://kandaceemory.com at launch
  name: 'Kandace Emory Pinterest Marketing',
  shortName: 'Kandace Emory',
  email: 'kandace.pinmarketing@gmail.com',
  facebook: 'https://www.facebook.com/kandacepinterestmarketing/',
  booking: 'https://kandaceemorypinmarketing.as.me/schedule/5b45ab1d/appointment/94096958/calendar/14168920',
  region: 'FL',
  country: 'US',
  /* the picture shown when the link is shared (texts, Facebook, LinkedIn) */
  shareImage: '/images/share.jpg',
  shareImageAlt: 'Kandace Emory Pinterest Marketing: moving your audience from inspiration to action',
};
