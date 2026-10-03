"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import {
  type FaceSurface,
  type Part,
  type Surface,
  DITHER_CELL as CELL,
  bayerThreshold,
  face,
  inkPath,
  oblique,
  sampleGrid,
} from "@/lib/dither-art";

interface EmptyStorefrontProps {
  className?: string;
}

// A little shop in the stub-art style (see lib/dither-art) — the same dithered, outlined drawing as
// EmptyCart and EmptyBag, in the cart's oblique view. A paper-white facade with a blank sign board,
// a striped awning with a scalloped valance, an empty shop window with one bare shelf, and a dark
// door with a sign hanging on it — the shop isn't open yet. It stands on a stretch of pavement:
// paving slabs out to a kerb, and its shadow cast off to the right.
//
// When the shop first comes into view a bird pays it a visit: it flies in from beyond the drawing's
// left edge, flapping, swoops past the sign board, flares and lands on the roof's edge. It looks back
// over its shoulder twice, then flies off to the right and leaves the shop empty. A mouse over the
// shop startles a perched bird off early, or, once it's gone, brings it back for another visit.

const COLS = 60;
const ROWS = 44;

type Kind = "front" | "side" | "roof" | "awning" | "valance" | "sign" | "ground";
type ShopSurface = Surface & Partial<Omit<FaceSurface<Kind>, keyof Surface>> & { kind: Kind };

// ── Building ─────────────────────────────────────────────────────────────────

const project = oblique([29, 74]);
const WIDTH = 56;
const DEPTH = 14;
const HEIGHT = 52;

const AWNING_TOP = 41; // Where the awning meets the facade.
const AWNING_OUT = 9; // How far it reaches toward you.
const AWNING_DROP = 4; // How far it slopes down as it does.
const VALANCE = 4; // Height of the hanging valance, scallops included.
const STRIPE = 7; // Width of each awning stripe.

// The pavement: from a little left of the shop to a little past it, and from the kerb (its front
// edge) back to the shop's back wall.
const PAVE_X0 = -8;
const PAVE_X1 = WIDTH + 10;
const PAVE_FRONT = -16;

const SHOP: Part<ShopSurface>[] = [
  face(project, [0, 0, 0], [WIDTH, 0, 0], [0, 0, HEIGHT], [0, 0, 1], "front", 0.5),
  face(project, [WIDTH, 0, 0], [0, DEPTH, 0], [0, 0, HEIGHT], [1, 0, 0.3], "side", 0.5),
  face(project, [0, 0, HEIGHT], [WIDTH, 0, 0], [0, DEPTH, 0], [0, -1, 0.4], "roof"),
  face(project, [-2, 0, AWNING_TOP], [WIDTH + 4, 0, 0], [0, -AWNING_OUT, -AWNING_DROP], [0, -0.8, 0.6], "awning", 1),
  face(project, [-2, -AWNING_OUT, AWNING_TOP - AWNING_DROP - VALANCE], [WIDTH + 4, 0, 0], [0, 0, VALANCE], [0, 0, 1], "valance", 1),
  face(project, [PAVE_X0, PAVE_FRONT, 0], [PAVE_X1 - PAVE_X0, 0, 0], [0, DEPTH - PAVE_FRONT, 0], [0, -1, 0.4], "ground"),
];

// The facade's features, in world x and h.
const SIGN_BOARD = { x0: 12, x1: 44, h0: 44, h1: 49 };
const WINDOW = { x0: 5, x1: 29, h0: 8, h1: 29 };
const SHELF = 16;
const DOOR = { x0: 35, x1: 50, h0: 0, h1: 31 };

function inside(x: number, h: number, box: { x0: number; x1: number; h0: number; h1: number }) {
  return x >= box.x0 && x <= box.x1 && h >= box.h0 && h <= box.h1;
}

function onBorder(x: number, h: number, box: { x0: number; x1: number; h0: number; h1: number }) {
  return inside(x, h, box) && Math.min(x - box.x0, box.x1 - x, h - box.h0, box.h1 - h) < 1.1;
}

// The sign hanging on the door, on a short cord from a nail.
const NAIL: [number, number] = project([42.5, 0, 29]);
const CORD = 4;
const SIGN_W = 13;
const SIGN_H = 9;

const doorSign: Part<ShopSurface> = (x, y) => {
  const across = x - NAIL[0];
  const down = y - NAIL[1];
  if (down >= CORD && down <= CORD + SIGN_H && Math.abs(across) <= SIGN_W / 2) {
    const s = across / SIGN_W + 0.5;
    const t = (down - CORD) / SIGN_H;
    const edge = Math.min(SIGN_W / 2 - Math.abs(across), down - CORD, CORD + SIGN_H - down) < 1.1;
    return { z: 2, n: [0, 0, 1], kind: "sign", s, t, edge };
  }
  if (down < 0 || down > CORD || Math.abs(across) > 1) return null;
  return { z: 2, n: [0, 0, 1], kind: "sign", s: 0, t: 0, edge: true };
};

// ── Drawing the shop ─────────────────────────────────────────────────────────

// Whether the awning's stripe at x (in world units along it) is a dark one.
function darkStripe(x: number) {
  return Math.floor((x + 2) / STRIPE) % 2 === 1;
}

// Whether a point on the valance is cut away below its scallops: each stripe ends in a half-round.
function belowScallop(x: number, h: number) {
  const local = ((x + 2) % STRIPE) - STRIPE / 2;
  const radius = STRIPE / 2;
  const reach = Math.sqrt(Math.max(0, radius * radius - local * local)) * (VALANCE / 2 / radius);
  return h < VALANCE / 2 - reach;
}

function frontInk(x: number, h: number, threshold: number) {
  if (onBorder(x, h, SIGN_BOARD) || onBorder(x, h, WINDOW) || onBorder(x, h, DOOR)) return true;
  if (inside(x, h, WINDOW)) {
    // An empty window: one bare shelf, and a glint across the glass.
    if (Math.abs(h - SHELF) < 1.1) return true;
    const glint = x - WINDOW.x0 + (h - WINDOW.h1);
    return glint > 4 && glint < 5.6 && h > WINDOW.h1 - 9;
  }
  if (inside(x, h, DOOR)) {
    // A solid dark door, with a light knob.
    const knobX = DOOR.x0 + 3;
    const knobH = 13;
    return (x - knobX) * (x - knobX) + (h - knobH) * (h - knobH) >= 2.5;
  }
  if (inside(x, h, SIGN_BOARD)) return false;
  // Paper-white facade, darkening a touch toward the street.
  return 1 - 0.9 * Math.max(0, 0.35 - h / HEIGHT) < threshold;
}

const SLAB = 11; // Paving slabs are this wide.

// The pavement at world (x, d): pale slabs with crisp joints running out to the kerb, and the shop's
// shadow cast off to the right, away from the upper-left light, fading out.
function groundInk(x: number, d: number, threshold: number) {
  if (x > WIDTH && d > -3) {
    const fade = Math.min(1, (x - WIDTH) / (PAVE_X1 - WIDTH));
    if (0.3 + 0.65 * fade < threshold) return true;
  }
  return d < 0 && Math.abs(((x - PAVE_X0 + SLAB / 2) % SLAB) - SLAB / 2) < 0.6;
}

const SHOP_HITS = sampleGrid<ShopSurface>([...SHOP, doorSign], COLS, ROWS);

// Which cells of the shop are ink, before any bird.
const SHOP_INK = SHOP_HITS.map((cells, row) =>
  cells.map((hit, col) => {
    if (!hit) return false;
    const threshold = bayerThreshold(row, col);
    const s = hit.s ?? 0;
    const t = hit.t ?? 0;
    if (hit.edge) return true;
    switch (hit.kind) {
      case "front":
        return frontInk(s * WIDTH, t * HEIGHT, threshold);
      case "side":
        return 0.3 < threshold;
      case "roof":
        return false;
      case "awning":
        // Crisp solid stripes; mid-tone dither would turn them into a lattice.
        return darkStripe(s * (WIDTH + 4));
      case "valance": {
        const x = s * (WIDTH + 4);
        const h = t * VALANCE;
        if (belowScallop(x, h)) return false;
        // The scallops' own edge, then the stripes.
        return belowScallop(x, h - 1.2) || darkStripe(x);
      }
      case "ground":
        return groundInk(PAVE_X0 + s * (PAVE_X1 - PAVE_X0), PAVE_FRONT + t * (DEPTH - PAVE_FRONT), threshold);
      default:
        // The door sign: a blank card with a line of lettering.
        return Math.abs(t - 0.5) < 0.12 && s > 0.3 && s < 0.7;
    }
  }),
);

const SHOP_PATH = inkPath(COLS, ROWS, (row, col) => SHOP_INK[row][col]);

// ── Bird ─────────────────────────────────────────────────────────────────────

// A blackbird, placed cell by cell — at this size a computed, shaded bird smears, so it's a crisp
// silhouette with one clear cell for its eye. Facing right: # is ink, o the eye, . sky. Each pose is
// anchored on its eye, so they stay in register as it flaps.
type Pose = "perched" | "up" | "down";

const SPRITES: Record<Pose, string[]> = {
  perched: [
    "........##.",
    ".......#o##",
    "...#######.",
    ".########..",
    "##..####...",
    "....#.#....",
  ],
  up: [
    "..#........",
    "...##......",
    "....###.##.",
    "#########o#",
    "..########.",
    "....####...",
  ],
  down: [
    "........##.",
    "#########o#",
    "..########.",
    "..######...",
    ".###.......",
    "##.........",
  ],
};

interface Sprite {
  cells: [number, number][];
  eyeRow: number;
  eyeCol: number;
  width: number;
}

function sprite(rows: string[], facing: 1 | -1): Sprite {
  const width = rows[0].length;
  const cells: [number, number][] = [];
  let eyeRow = 0;
  let eyeCol = 0;
  rows.forEach((line, row) =>
    [...line].forEach((mark, i) => {
      const col = facing === 1 ? i : width - 1 - i;
      if (mark === "#") cells.push([row, col]);
      if (mark === "o") [eyeRow, eyeCol] = [row, col];
    }),
  );
  return { cells, eyeRow, eyeCol, width };
}

interface BirdFrame {
  /** The bird's ink, in px from (left, top). */
  path: string;
  left: number;
  top: number;
  /** Shop cells to clear round the bird, as row * COLS + col. */
  covers: Set<number>;
}

// The bird in a pose with its eye in the cell at (eyeCol, eyeRow) of the shop's grid, facing right
// (1) or left (-1).
function bird(eyeCol: number, eyeRow: number, pose: Pose, facing: 1 | -1): BirdFrame {
  const { cells, eyeRow: spriteRow, eyeCol: spriteCol } = sprite(SPRITES[pose], facing);
  const col0 = eyeCol - spriteCol;
  const row0 = eyeRow - spriteRow;
  // Clear the shop under the bird and a cell to each side of and above it, so the roof's lines never
  // run into the silhouette — but not below, so a perched bird still stands on the roof's edge.
  const covers = new Set<number>();
  const cover = (row: number, col: number) => {
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) covers.add(row * COLS + col);
  };
  let path = "";
  for (const [row, col] of cells) {
    path += `M${col * CELL} ${row * CELL}h${CELL}v${CELL}h${-CELL}z`;
    cover(row0 + row, col0 + col);
    cover(row0 + row - 1, col0 + col);
    cover(row0 + row, col0 + col - 1);
    cover(row0 + row, col0 + col + 1);
  }
  // The eye is a hole in the silhouette, so clear the shop behind it too.
  cover(eyeRow, eyeCol);
  return { path, left: col0 * CELL, top: row0 * CELL, covers };
}

// ── Flight ───────────────────────────────────────────────────────────────────

// The perch: on the roof's front edge, right of centre, with the bird's feet on the edge's line. Its
// eye sits four cells above them.
const ROOF_ROW = Math.floor(project([0, 0, HEIGHT])[1] / CELL) - 1;
const PERCH_EYE: [number, number] = [39, ROOF_ROW - 5];

function curve(p0: [number, number], p1: [number, number], p2: [number, number], t: number): [number, number] {
  const a = (1 - t) * (1 - t);
  const b = 2 * (1 - t) * t;
  const c = t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
}

// Flight paths run through cells (col, row); the bird is placed by its eye.
const PERCH_PX: [number, number] = [PERCH_EYE[0] * CELL, PERCH_EYE[1] * CELL];
const at = ([x, y]: [number, number]): [number, number] => [Math.round(x / CELL), Math.round(y / CELL)];

const FLY_IN_STEPS = 14;
const FLARE = 2; // Steps at the end of the approach with wings raised, braking to land.

// Flying in: from beyond the left edge, a swoop down past the sign board and up to the perch,
// slowing as it lands. Wings beat a stroke per step, then flare just above the perch.
const FLY_IN: BirdFrame[] = Array.from({ length: FLY_IN_STEPS }, (_, step) => {
  const k = step / (FLY_IN_STEPS - 1);
  const t = 1 - (1 - k) * (1 - k);
  const [col, row] = at(curve([-44, -8], [24, 40], [PERCH_PX[0], PERCH_PX[1] - CELL], t));
  const pose: Pose = step >= FLY_IN_STEPS - FLARE || step % 2 === 0 ? "up" : "down";
  return bird(col, row, pose, 1);
});

// Landed, and looking back over its shoulder.
const PERCHED = bird(PERCH_EYE[0], PERCH_EYE[1], "perched", 1);
// Turned round, the same cells: its eye moves to the mirrored spot.
const PERCHED_EYE_COL = sprite(SPRITES.perched, 1).eyeCol;
const LOOKING_BACK = bird(PERCH_EYE[0] - PERCHED_EYE_COL + (SPRITES.perched[0].length - 1 - PERCHED_EYE_COL), PERCH_EYE[1], "perched", -1);

// Leaving: a hop with wings up, then off up and to the right past the edge, speeding up.
const TAKE_OFF_STEPS = 8;
const TAKE_OFF: BirdFrame[] = Array.from({ length: TAKE_OFF_STEPS }, (_, step) => {
  const k = step / (TAKE_OFF_STEPS - 1);
  const [col, row] = at(curve([PERCH_PX[0], PERCH_PX[1] - CELL], [PERCH_PX[0] + 20, PERCH_PX[1] - 10], [COLS * CELL + 40, -28], k * k));
  return bird(col, row, step % 2 === 0 ? "up" : "down", 1);
});

const hold = (frame: BirdFrame, steps: number) => Array.from({ length: steps }, () => frame);

// A visit: fly in, look ahead a while, look back over its shoulder twice — turning forward again
// between and after — then fly off. Once it's gone the sky stays empty.
const VISIT: BirdFrame[] = [
  ...FLY_IN,
  ...hold(PERCHED, 26),
  ...hold(LOOKING_BACK, 12),
  ...hold(PERCHED, 10),
  ...hold(LOOKING_BACK, 12),
  ...hold(PERCHED, 8),
  ...TAKE_OFF,
];

const FPS = 10;

// The shop's ink with the cells under the bird left clear, so the bird sits in front of it.
const SHOP_PATHS = new Map<BirdFrame | null, string>();
function shopPathUnder(frame: BirdFrame | null) {
  if (!frame?.covers.size) return SHOP_PATH;
  if (!SHOP_PATHS.has(frame)) SHOP_PATHS.set(frame, inkPath(COLS, ROWS, (row, col) => SHOP_INK[row][col] && !frame.covers.has(row * COLS + col)));
  return SHOP_PATHS.get(frame)!;
}

// Draws a frame of the bird (or none) into the shop's two paths.
function paint(shop: SVGPathElement | null, bird: SVGPathElement | null, frame: BirdFrame | null) {
  shop?.setAttribute("d", shopPathUnder(frame));
  bird?.setAttribute("d", frame?.path ?? "");
  bird?.setAttribute("transform", frame ? `translate(${frame.left} ${frame.top})` : "");
}

export default function EmptyStorefront({ className }: EmptyStorefrontProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const shopRef = useRef<SVGPathElement>(null);
  const birdRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();
  // What's playing — a visit, or just the leaving — and when it began (on its first frame). Once it
  // has played out the bird is gone, and the frame loop stops until a mouse brings it back.
  const story = useRef<BirdFrame[]>(VISIT);
  const start = useRef<number | null>(null);
  const shown = useRef<BirdFrame | null>(null);
  const [playing, setPlaying] = useState(true);

  useSteppedFrames(
    svgRef,
    FPS,
    () => {
      // Timed by the page's clock rather than the frame loop's, which restarts whenever the loop does.
      const now = performance.now() / 1000;
      if (start.current === null) start.current = now;
      const step = Math.max(0, Math.floor((now - start.current) * FPS));
      const frame = story.current[step] ?? null;
      if (frame === null) setPlaying(false);
      if (frame === shown.current) return;
      shown.current = frame;
      paint(shopRef.current, birdRef.current, frame);
    },
    !reduceMotion && playing,
  );

  // Under reduced motion the bird is simply there on its perch — including if the setting turns on
  // mid-flight.
  useEffect(() => {
    if (!reduceMotion) return;
    shown.current = PERCHED;
    paint(shopRef.current, birdRef.current, PERCHED);
  }, [reduceMotion]);

  // A mouse over the shop startles a perched bird off early, or brings a gone one back to visit.
  // Mid-flight, it's left to fly.
  function disturb() {
    const frame = shown.current;
    if (frame === PERCHED || frame === LOOKING_BACK) story.current = TAKE_OFF;
    else if (!playing) story.current = VISIT;
    else return;
    start.current = null;
    setPlaying(true);
  }

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      onPointerEnter={(event) => event.pointerType === "mouse" && disturb()}
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      // The bird flies in from, and off to, beyond the drawing's edges.
      overflow="visible"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-22 w-30 text-neutral-900"}
    >
      {/* Both paths are redrawn frame by frame; React only sets the empty-sky starting frame. */}
      <path ref={shopRef} d={SHOP_PATH} />
      <path ref={birdRef} />
    </svg>
  );
}
