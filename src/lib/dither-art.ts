// Shared renderer for the dithered illustrations on the ticket stubs (GenieLamp, MoneyStack). A
// drawing is a list of shaded parts sampled on a grid of 2px cells; the frontmost part per cell is
// lit from the upper left and thresholded against a 4×4 Bayer matrix — the same grain as the ticket
// shader's dither — and every silhouette and overlap gets a one-cell ink outline. The output is one
// SVG path of black cells, so the art is pure black and white.
//
// Only + − × ÷ and sqrt are used, so server and client build the identical path.

export const DITHER_CELL = 2;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function bayerThreshold(row: number, col: number) {
  return (BAYER[(row % 4) * 4 + (col % 4)] + 0.5) / 16;
}

export type Vec = [number, number, number];

/** What a part reports for a point it covers: its depth (higher is nearer) and surface normal. */
export interface Surface {
  z: number;
  n: Vec;
}

export type Part<S extends Surface = Surface> = (x: number, y: number) => S | null;

export type Hit<S extends Surface = Surface> = S & { part: number };

export function normalize([x, y, z]: Vec): Vec {
  const length = Math.sqrt(x * x + y * y + z * z);
  return [x / length, y / length, z / length];
}

const LIGHT = normalize([-0.6, -0.55, 0.58]);
const HALFWAY = normalize([LIGHT[0], LIGHT[1], LIGHT[2] + 1]);

/** Wrapped diffuse plus a tight highlight, 0–1. View space: x right, y down, z toward the viewer. */
export function brightness(n: Vec) {
  const [x, y, z] = normalize(n);
  const diffuse = Math.max(0, x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2]);
  const wrapped = 0.5 + 0.5 * diffuse;
  let specular = Math.max(0, x * HALFWAY[0] + y * HALFWAY[1] + z * HALFWAY[2]);
  specular *= specular;
  specular *= specular;
  specular *= specular;
  specular *= specular; // ^16
  return Math.min(1, 0.95 * wrapped * wrapped * wrapped + 0.7 * specular);
}

export function frontmost<S extends Surface>(parts: Part<S>[], x: number, y: number): Hit<S> | null {
  let best: Hit<S> | null = null;
  for (let index = 0; index < parts.length; index++) {
    const hit = parts[index](x, y);
    if (hit && (!best || hit.z > best.z)) best = { ...hit, part: index };
  }
  return best;
}

/** 1 at (cx, cy), falling linearly to 0 at the edge of the ellipse with radii rx, ry — for floor shadows. */
export function ellipseFalloff(x: number, y: number, cx: number, cy: number, rx: number, ry: number) {
  const u = (x - cx) / rx;
  const v = (y - cy) / ry;
  return Math.max(0, 1 - Math.sqrt(u * u + v * v));
}

/** Samples the parts at the centre of every cell. */
export function sampleGrid<S extends Surface>(parts: Part<S>[], cols: number, rows: number) {
  const hits: (Hit<S> | null)[][] = [];
  for (let row = 0; row < rows; row++) {
    hits.push([]);
    for (let col = 0; col < cols; col++) {
      hits[row].push(frontmost(parts, col * DITHER_CELL + DITHER_CELL / 2, row * DITHER_CELL + DITHER_CELL / 2));
    }
  }
  return hits;
}

/** True on the silhouette, or where a part meets another standing in front of it. */
export function isOutline(hits: (Hit | null)[][], row: number, col: number) {
  const hit = hits[row][col];
  if (!hit) return false;
  const neighbours = [hits[row][col + 1], hits[row][col - 1], hits[row + 1]?.[col], hits[row - 1]?.[col]];
  return neighbours.some((n) => !n || (n.part !== hit.part && n.z > hit.z + 1.5));
}

/** One SVG rect per horizontal run of inked cells. rowOffset shifts the drawing down by whole rows. */
export function inkPath(cols: number, rows: number, ink: (row: number, col: number) => boolean, rowOffset = 0) {
  let path = "";
  for (let row = 0; row < rows; row++) {
    let runStart = -1;
    for (let col = 0; col <= cols; col++) {
      const inked = col < cols && ink(row, col);
      if (inked && runStart < 0) runStart = col;
      if (!inked && runStart >= 0) {
        const width = (col - runStart) * DITHER_CELL;
        path += `M${runStart * DITHER_CELL} ${(row + rowOffset) * DITHER_CELL}h${width}v${DITHER_CELL}h${-width}z`;
        runStart = -1;
      }
    }
  }
  return path;
}

// ── Oblique solids ───────────────────────────────────────────────────────────
// Boxy things (EmptyBag, EmptyStorefront, EmptyBox, and EmptyBell's counter) are built from flat
// faces. World x runs right, d into the page and h up; oblique() is the cart's view, with d shearing
// up and right. face() takes any projection, so a drawing can look from elsewhere.

export type World = [x: number, d: number, h: number];

export function oblique(origin: [number, number]) {
  return ([x, d, h]: World): [number, number] => [origin[0] + x + 0.5 * d, origin[1] - h - 0.5 * d];
}

export type FaceSurface<K extends string> = Surface & {
  kind: K;
  /** Where the point falls on the face, 0–1 along u and along v. */
  s: number;
  t: number;
  /** Within about a px of the face's border, for drawing its edges. */
  edge: boolean;
};

/**
 * A flat parallelogram, corner + s·u + t·v for s and t in 0–1, given in world space. Nearer faces
 * (smaller d) win; zBias lifts one face over another at a shared edge. edgeWidth is how close (px)
 * to its border a point counts as edge — widen it for slanted borders, which fall between cells.
 */
export function face<K extends string>(
  project: (point: World) => [number, number],
  corner: World,
  u: World,
  v: World,
  n: Vec,
  kind: K,
  zBias = 0,
  edgeWidth = 1.1,
): Part<FaceSurface<K>> {
  const [px, py] = project(corner);
  const [ux, uy] = project([corner[0] + u[0], corner[1] + u[1], corner[2] + u[2]]);
  const [vx, vy] = project([corner[0] + v[0], corner[1] + v[1], corner[2] + v[2]]);
  const ax = ux - px;
  const ay = uy - py;
  const bx = vx - px;
  const by = vy - py;
  const det = ax * by - ay * bx;
  const uLength = Math.sqrt(ax * ax + ay * ay);
  const vLength = Math.sqrt(bx * bx + by * by);
  const area = Math.abs(det);
  return (x, y) => {
    const s = ((x - px) * by - (y - py) * bx) / det;
    const t = ((y - py) * ax - (x - px) * ay) / det;
    if (s < 0 || s > 1 || t < 0 || t > 1) return null;
    // Distance in px to the nearest border: across u's sides and across v's sides.
    const toSides = (Math.min(s, 1 - s) * area) / vLength;
    const toEnds = (Math.min(t, 1 - t) * area) / uLength;
    return { z: -(corner[1] + s * u[1] + t * v[1]) + zBias, n, kind, s, t, edge: Math.min(toSides, toEnds) < edgeWidth };
  };
}
