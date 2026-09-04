# Kandace Emory: Pinterest Marketing

Astro static site. Free hosting on Cloudflare Pages, free editing through Pages CMS.

## Run it locally

Open **this folder** in VS Code and run:

```
npm install
npm run dev
```

That's it. No `cd`, nothing nested. The site is at http://localhost:4321

To produce the deploy folder:

```
npm run build
```

Output lands in `dist/`. That's the folder you upload to Cloudflare Pages.

---

## Where things live

| What | Where |
| --- | --- |
| The domain, email, booking link | `src/site.config.mjs`: **one file, change it once** |
| All page copy | `src/content/pages/*.md` |
| What the CMS shows Kandace | `.pages.yml` |
| Section layouts | `src/components/sections/` |
| Fonts (self-hosted woff2) | `src/styles/fonts.css` + `public/fonts/` |
| Palette, type scale, base | `src/styles/tokens.css` |
| Everything the sections use | `src/styles/components.css` |
| Old chunk 1 skeleton | `src/styles/skeleton.css`: no longer imported |
| The frond animation (chunk 3) | `src/components/Fronds.astro`: built, not switched on yet |
| Images | `public/images/` |

### The domain

`src/site.config.mjs` has `SITE.url` set to a placeholder. When Kandace's
domain is confirmed, change that one line. Canonical tags, the sitemap,
robots.txt and all the structured data follow from it automatically.

Also update the `Sitemap:` line in `public/robots.txt`.

---

## Adding a page

Copy any file in `src/content/pages/`, give it a new `urlPath`, done -
the route picks it up with no code change. `urlPath: about-me` becomes
`/about-me/`.

`urlPath: index` is the home page. Only one page should use it.

In Pages CMS this is the "duplicate" button on a page entry.

---

## Buttons

Instead of pasting the long Acuity link into every button, type
`BOOKING_URL` as the link and it resolves to whatever is in
`site.config.mjs`. Change the booking link in one place and every
button on the site updates.

`EMAIL` works the same way for mailto links.

---

## Deploying to Cloudflare Pages

Build command `npm run build`, output directory `dist`, and that's the
whole configuration. Cloudflare's free tier covers 500 builds a month,
which is far more than this site will ever use.

---

## Chunk status

- [x] **Chunk 1: Structure.** Every section, working buttons, CMS wired,
      structured data live. Raised to a presentable floor on 4 Sep: her
      fonts, her palette, navy grounding, real spacing.
- [ ] **Chunk 2: Brand.** The lattice motif, colour blocking, the layout
      personality. Layers on top of `components.css`, does not replace it.
- [ ] **Chunk 3: Motion.**
- [x] **Copy.** All strings written from her portfolio and email, 4 Sep.
      Draft for Kandace to correct.

### A note on the stylesheets

An earlier version of this README said chunk 2 was "replace the
`skeleton.css` import with `tokens.css`". That would have broken the
page: `tokens.css` has no rules for `.act`, `.chapter`, `.strip`,
`.block`, `.grid`, the header or the footer, and its button classes
are not the ones the sections use. The component rules now live in
`components.css`, which loads after `tokens.css`. Add to it; don't
swap it out.

---

## Optional: browser tests

Not installed by default, deliberately: it keeps `npm install` fast.
If you want them:

```
npm install -D playwright && npx playwright install chromium
```
