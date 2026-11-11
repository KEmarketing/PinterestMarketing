/* Security headers for every page, written into dist/_headers at the end
   of each build (Cloudflare Pages reads that file).

   The content security policy only lets the browser run the scripts that
   are actually in the page. Those scripts are inline, so each one is
   identified by a hash of its exact text. The hashes are worked out here
   from the built pages, so an edit anywhere on the site (including every
   save from the editor) gets fresh hashes on its own. Nothing to maintain.

   Values follow the OWASP Secure Headers Project proposal (Nov 2026),
   adjusted for this site:
   - style-src-attr allows inline style attributes, because the fronds
     and a few animations are positioned with them. Elements still have
     to come from this site's own stylesheets.
   - HSTS is two years with subdomains, no preload (hstspreload.org
     advises against preloading by default, and it cannot easily be undone).
   - Cache-Control is left to Cloudflare: this is a public site, not an app. */

import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function securityHeaders() {
  return {
    name: 'security-headers',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const hashes = new Set();
        for (const file of await htmlFiles(dist)) {
          const html = await readFile(file, 'utf8');
          /* every inline <script> that runs, so not the JSON-LD block */
          const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
          let m;
          while ((m = re.exec(html))) {
            const type = /type\s*=\s*["']([^"']+)["']/i.exec(m[1])?.[1];
            if (type && !/^(text\/javascript|module|application\/javascript)$/i.test(type)) continue;
            const digest = createHash('sha256').update(m[2], 'utf8').digest('base64');
            hashes.add(`'sha256-${digest}'`);
          }
        }
        const scriptSrc = ["'self'", ...hashes].join(' ');
        const csp = [
          "default-src 'self'",
          `script-src ${scriptSrc}`,
          "style-src-elem 'self'",
          "style-src-attr 'unsafe-inline'",
          "img-src 'self'",
          "font-src 'self'",
          "connect-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          'upgrade-insecure-requests',
        ].join('; ');

        const block = [
          '',
          '# Security headers for every page. Generated at build time by',
          '# src/security-headers.mjs; edit that file, not this one.',
          '/*',
          '  Strict-Transport-Security: max-age=63072000; includeSubDomains',
          `  Content-Security-Policy: ${csp}`,
          '  X-Frame-Options: DENY',
          '  X-Content-Type-Options: nosniff',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '  Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), usb=(), xr-spatial-tracking=()',
          '  Cross-Origin-Opener-Policy: same-origin',
          '  Cross-Origin-Resource-Policy: same-origin',
          '  X-Permitted-Cross-Domain-Policies: none',
          '  ! Access-Control-Allow-Origin',
          '',
        ].join('\n');

        const target = join(dist, '_headers');
        let existing = '';
        try { existing = await readFile(target, 'utf8'); } catch {}
        await writeFile(target, existing.trimEnd() + '\n' + block, 'utf8');
        logger.info(`_headers written with ${hashes.size} script hashes`);
      },
    },
  };
}
