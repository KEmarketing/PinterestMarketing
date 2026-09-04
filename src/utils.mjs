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
