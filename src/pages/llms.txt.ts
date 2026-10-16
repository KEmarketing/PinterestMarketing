import { getEntry } from 'astro:content';
import { SITE } from '../site.config.mjs';

/* llms.txt: a plain summary of the page for AI tools (ChatGPT,
   Perplexity, Gemini and the like) that read it to answer questions
   about her. Built from the same CMS fields as the page, so it updates
   itself whenever she edits her copy. */
const plain = (t = '') =>
  String(t).replace(/\*\*|__/g, '').replace(/(^|\s)\*(\S)/g, '$1$2').replace(/\s+/g, ' ').trim();

export async function GET() {
  const entry = await getEntry('pages', 'index');
  const d = entry?.data ?? {};
  const site = SITE.url;
  const L = [];

  L.push(`# ${SITE.name}`, '');
  L.push(`> ${plain(d.metaDescription)}`, '');
  const about = String(d.about?.body ?? '').split(/\n\s*\n/).map(plain).filter(Boolean);
  L.push(`Kandace Emory is a Pinterest marketing manager based in Florida, United States.`);
  about.forEach((p) => L.push('', p));
  L.push('');

  if (d.explainer) {
    L.push(`## ${plain(d.explainer.heading)}`, '', plain(d.explainer.body), '');
    (d.explainer.points ?? []).forEach((p) => L.push(`- ${plain(p.heading)}: ${plain(p.body)}`));
    L.push('');
  }

  if (d.whoFor) {
    L.push(`## Who it's for`, '');
    (d.whoFor.items ?? []).forEach((i) => L.push(`- ${plain(i)}`));
    if (d.whoFor.needs?.length) {
      L.push('', `${plain(d.whoFor.needsHeading)}`, '');
      d.whoFor.needs.forEach((i) => L.push(`- ${plain(i)}`));
    }
    L.push('');
  }

  if (d.packages?.items?.length) {
    L.push('## Packages and pricing', '');
    if (d.packages.intro) L.push(plain(d.packages.intro), '');
    for (const p of d.packages.items) {
      L.push(`### ${plain(p.name)}: ${plain(p.price)}${p.cadence ? ` ${plain(p.cadence)}` : ''}`, '');
      if (p.summary) L.push(plain(p.summary), '');
      (p.features ?? []).forEach((f) => L.push(`- ${plain(f).replace(/\*$/, '')}`));
      L.push('');
    }
    if (d.packages.note) L.push(plain(d.packages.note).replace(/^\*/, ''), '');
  }

  if (d.process?.steps?.length) {
    L.push(`## How it works`, '');
    d.process.steps.forEach((s, i) => L.push(`${i + 1}. ${plain(s.heading)}: ${plain(s.body)}`));
    L.push('');
  }

  if (d.faq?.items?.length) {
    L.push('## Frequently asked questions', '');
    for (const f of d.faq.items) L.push(`### ${plain(f.question)}`, '', plain(f.answer), '');
  }

  L.push('## Contact', '');
  L.push(`- Book a free discovery call: ${SITE.booking}`);
  L.push(`- Email: ${SITE.email}`);
  SITE.profiles.filter((u) => u !== SITE.facebook).forEach((u) => L.push(`- Profile: ${u}`));
  L.push(`- Facebook: ${SITE.facebook}`);
  L.push(`- Website: ${site}/`);
  L.push('');

  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
