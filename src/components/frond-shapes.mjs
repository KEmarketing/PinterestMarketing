/* The frond's shapes, computed once at build time and shared by every
   frond on the page. The page draws the paths a single time, inside a
   hidden symbol library at the top of the body, and each frond refers to
   them by id. Fifteen fronds used to carry fifteen copies of the same
   paths, which made the page 1.3 MB of HTML. */
/* ---- geometry -------------------------------------------------
   Build one frond: a curved rachis (stem) with tapering leaflets
   alternating down both sides. Generated here at build time so the
   markup ships as plain static SVG with no runtime cost.        */

const LEAFLETS = 17;
const LEN = 390;      // rachis length
const ARC = 96;       // how much the rachis curves

function stemPoint(t) {
  const x = 2 * (1 - t) * t * (LEN * 0.42) + t * t * LEN;
  const y = 2 * (1 - t) * t * -ARC + t * t * -ARC * 0.5;
  return [x, y];
}
function stemTangent(t) {
  const d = 0.001;
  const [x1, y1] = stemPoint(Math.max(0, t - d));
  const [x2, y2] = stemPoint(Math.min(1, t + d));
  return Math.atan2(y2 - y1, x2 - x1);
}

/* One leaflet, built by walking a curved spine and giving it a width
   profile: narrow where it joins the rachis, close to parallel sided
   through the middle, then tapering to a fine point. That parallel
   middle is what makes it read as a leaf. Even widening and narrowing
   reads as an almond, and a straight line at a fixed angle reads as a
   spine, which is what the first version looked like. */
/* The cut where a leaflet meets the rachis runs ALONG the rachis, not
   square across the blade. A square cut leaves a blunt edge crossing the
   stem at an angle, which is what made the leaflets look laid on top of
   it rather than grown out of it. The skew is only at the very base and
   fades out over the first sixth of the blade, so the direction the leaf
   points is unchanged. */
function baseSkew(s, tx, ty, nx, ny, fx, fy) {
  const k = Math.min(1, s / 0.16);
  const damp = 1 - k * k * (3 - 2 * k);
  if (damp <= 0) return 0;
  const fN = fx * nx + fy * ny;
  if (Math.abs(fN) < 1e-6) return 0;
  const ratio = Math.max(-2.6, Math.min(2.6, (fx * tx + fy * ty) / fN));
  return ratio * damp;
}

function blade(bx, by, dir, fwd, L, W, curve) {
  const N = 16;
  const [dx, dy] = dir, [fx, fy] = fwd;
  const outer = [], inner = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const px = bx + dx * L * s + fx * curve * Math.pow(s, 1.7);
    const py = by + dy * L * s + fy * curve * Math.pow(s, 1.7);
    const e = 0.002, s2 = Math.min(1, s + e);
    const qx = bx + dx * L * s2 + fx * curve * Math.pow(s2, 1.7);
    const qy = by + dy * L * s2 + fy * curve * Math.pow(s2, 1.7);
    const tl = Math.hypot(qx - px, qy - py) || 1;
    const tx = (qx - px) / tl, ty = (qy - py) / tl;
    const nx = -ty, ny = tx;
    const w = W * Math.pow(1 - Math.pow(s, 2.6), 0.5) * (0.34 + 0.66 * Math.min(1, s / 0.16));
    const sk = baseSkew(s, tx, ty, nx, ny, fx, fy) * w;
    outer.push([px + nx * w + tx * sk, py + ny * w + ty * sk]);
    inner.push([px - nx * w - tx * sk, py - ny * w - ty * sk]);
  }
  const pts = outer.concat(inner.reverse());
  const outline = 'M ' + pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L ') + ' Z';

  /* Veins: a midrib plus two fine lines either side of it. Palm leaflets
     are striped lengthwise, and without them the blades read as flat
     paper cut-outs however well they are shaded. */
  const line = (k) => {
    const p = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const px = bx + dx * L * s + fx * curve * Math.pow(s, 1.7);
      const py = by + dy * L * s + fy * curve * Math.pow(s, 1.7);
      const e = 0.002, s2 = Math.min(1, s + e);
      const qx = bx + dx * L * s2 + fx * curve * Math.pow(s2, 1.7);
      const qy = by + dy * L * s2 + fy * curve * Math.pow(s2, 1.7);
      const tl = Math.hypot(qx - px, qy - py) || 1;
      const tx = (qx - px) / tl, ty = (qy - py) / tl;
      const nx = -ty, ny = tx;
      const w = W * Math.pow(1 - Math.pow(s, 2.6), 0.5) * (0.34 + 0.66 * Math.min(1, s / 0.16));
      const sk = baseSkew(s, tx, ty, nx, ny, fx, fy) * w * k;
      p.push([px + nx * w * k + tx * sk, py + ny * w * k + ty * sk]);
    }
    return 'M ' + p.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L ');
  };
  return { outline, veins: [line(0), line(0.5), line(-0.5)].join(' ') };
}

const leaflets = [];
for (let i = 0; i < LEAFLETS; i++) {
  const t = 0.05 + (i / (LEAFLETS - 1)) * 0.94;
  const [x, y] = stemPoint(t);
  const ang = stemTangent(t);

  const u = Math.min(1, Math.max(0, (t - 0.03) / 0.97));
  const bell = Math.sin(Math.PI * Math.pow(u, 0.85));
  const bladeLen = 52 + bell * 168;
  const bladeW   = 3.6 + bell * 6.4;

  for (const side of [-1, 1]) {
    const spread = (1.16 - 0.34 * t) * side;
    const a = ang + spread;
    const shape = blade(x, y, [Math.cos(a), Math.sin(a)], [Math.cos(ang), Math.sin(ang)],
                        bladeLen, bladeW, bladeLen * (0.10 + 0.10 * t));
    leaflets.push({ d: shape.outline, veins: shape.veins, i, side, ax: x, ay: y });
  }
}

const BANDS = 3;
const bands = [];
for (let bnd = 0; bnd < BANDS; bnd++) {
  const from = Math.floor((bnd * LEAFLETS) / BANDS);
  const [ox, oy] = stemPoint(0.05 + (from / (LEAFLETS - 1)) * 0.94);
  bands.push({ ox, oy, leaves: leaflets.filter(l => Math.floor((l.i * BANDS) / LEAFLETS) === bnd) });
}

/* The rachis is drawn in three pieces, one inside each joint, so the
   stem bends with its leaves instead of staying rigid while they move. */
function stemSegment(t0, t1) {
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const [px, py] = stemPoint(t0 + (t1 - t0) * (i / 12));
    pts.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
}
const bandT = [0, 1 / 3, 2 / 3, 1].map((f) => 0.05 + f * 0.94);
bands.forEach((b, i) => { b.stem = stemSegment(i === 0 ? 0 : bandT[i], bandT[i + 1]); });

/* The cast shadow draws each section's leaves as one merged silhouette
   rather than as separate shapes. Overlaps resolve under the nonzero
   fill rule, so nothing double-darkens, and it takes three paths per
   frond instead of twenty-six, which is what buys the frame rate back. */
bands.forEach((b) => { b.silhouette = b.leaves.map((l) => l.d).join(' '); });

export const BANDS_COUNT = BANDS;
export { bands };
/* Ids for the shared paths. */
export const ids = {
  silhouette: (i) => `fr-s${i}`,
  stem: (i) => `fr-r${i}`,
  leaf: (i, j) => `fr-l${i}-${j}`,
  veins: (i, j) => `fr-v${i}-${j}`,
};
