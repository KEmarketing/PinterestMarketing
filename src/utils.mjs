import { SITE } from './site.config.mjs';

/** Lets the CMS use the friendly token BOOKING_URL instead of
 *  pasting the long Acuity link into every button. */
export function resolveUrl(url) {
  if (!url) return '#';
  if (url === 'BOOKING_URL') return SITE.booking;
  if (url === 'EMAIL') return `mailto:${SITE.email}`;
  return url;
}

/** True while a field still holds stand-in copy. Used to keep
 *  placeholder text out of the structured data. */
export function isPlaceholder(text) {
  return typeof text === 'string' && text.trim().startsWith('PLACEHOLDER');
}

/** Kandace emphasises words by capitalising them. Shouting reads badly at
 *  display sizes, so the CMS marks them **like this** and the site colours
 *  them in the brand accent instead. Single asterisks are left alone: the
 *  packages copy uses them as footnote markers.
 *  Escapes first, so nothing in a CMS field can inject markup. */
export function emphasise(text) {
  const esc = String(text ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\*\*(.+?)\*\*/g, '<span class="mark">$1</span>');
}
