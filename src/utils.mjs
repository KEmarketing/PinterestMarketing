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
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<span class="mark">$1</span>')
    /* __like this__ underlines in the accent instead: her explainer
       mockup underlines "Pinterest is a search engine" in coral. */
    .replace(/__(.+?)__/g, '<span class="mark mark--line">$1</span>');
}

/** Line breaks from the CMS, kept the way she typed them.
 *  A text box in the editor can hold several lines: pressing Enter once
 *  starts a new line, and leaving an empty line starts a new paragraph.
 *  These helpers carry that through to the page. Everything is escaped,
 *  so nothing typed in a box can inject markup. */
const esc = (t) => String(t ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The text split into paragraphs, each a list of its lines. */
export function paragraphs(text) {
  return String(text ?? '')
    .replace(/\r\n?/g, '\n')
    .split(/\n[ \t]*\n/)
    .map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((p) => p.length);
}

/** One paragraph's lines as HTML, joined by line breaks. With emph, the
 *  **coral highlight** and __coral underline__ marks are applied too. */
export function linesHtml(lines, emph = false) {
  return lines.map((l) => (emph ? emphasise(l) : esc(l))).join('<br>');
}

/** A whole box as HTML for a single element on the page: Enter becomes a
 *  line break and an empty line becomes an empty line. */
export function blockHtml(text, emph = false) {
  return paragraphs(text).map((p) => linesHtml(p, emph)).join('<br><br>');
}
