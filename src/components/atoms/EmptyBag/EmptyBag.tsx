"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedSequence } from "@/hooks/use-stepped-sequence";
import { type FaceSurface, type Part, type Surface, DITHER_CELL as CELL, bayerThreshold, face, inkPath, oblique, sampleGrid } from "@/lib/dither-art";

interface EmptyBagProps {
  className?: string;
}

// An empty paper shopping bag in the stub-art style (see lib/dither-art) — the same dithered,
// outlined drawing as EmptyCart and EmptySearch, in the cart's oblique view. Flat faces: a light
// front with a folded rim, a dark gusset side with a pale crease, and an open top that is a dark,
// empty slot. Two thin cord handles rise from the rim. When the bag first comes into view it is set
// down: it drops the last few px to the floor and its handles swing from the impact, then settle; a
// mouse over it picks it up and sets it down again. It stands on a soft dithered floor like
// GenieLamp's, fading out evenly all round its foot.

const COLS = 60;
const ROWS = 44;

type Kind = "front" | "side" | "inside" | "handle";
type BagSurface = Surface & Partial<Omit<FaceSurface<Kind>, keyof Surface>> & { kind: Kind };

// ── Bag ──────────────────────────────────────────────────────────────────────

// x stays odd: the narrow gusset only lands on enough cells to show its shade and crease that way.
const ORIGIN: [number, number] = [37, 70];
const project = oblique(ORIGIN);
const WIDTH = 40;
const DEPTH = 12;
const HEIGHT = 46;
const FOLD = 37; // Height of the folded-over rim's lower edge.

const BAG: Part<BagSurface>[] = [
  face(project, [0, 0, 0], [WIDTH, 0, 0], [0, 0, HEIGHT], [0, 0, 1], "front", 0.5),
  face(project, [WIDTH, 0, 0], [0, DEPTH, 0], [0, 0, HEIGHT], [1, 0, 0.3], "side", 0.5),
  face(project, [0, 0, HEIGHT], [WIDTH, 0, 0], [0, DEPTH, 0], [0, -1, 0.4], "inside"),
];

// ── Handles ──────────────────────────────────────────────────────────────────

const HANDLE_X = WIDTH / 2;
const HANDLE_SPAN = 9; // Radius of each handle's arch.
const ROPE = 1.3;

// A rope handle arching up from the rim at depth d, its top swung `sway` px to one side.
function handle(d: number, sway: number): Part<BagSurface> {
  const [cx, cy] = project([HANDLE_X, d, HEIGHT]);
  return (x, y) => {
    const dy = y - cy;
    if (dy > 0.5) return null;
    // The swing grows with height, so the arch leans from its feet.
    const dx = x - cx + (sway * dy) / HANDLE_SPAN;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return null;
    const e = distance - HANDLE_SPAN;
    const s = 1 - (e * e) / (ROPE * ROPE);
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    return { z: -d + 1 + w * ROPE, n: [((dx / distance) * e) / ROPE, ((dy / distance) * e) / ROPE, w], kind: "handle" };
  };
}

// ── Drawing ──────────────────────────────────────────────────────────────────

// Shadow (0–1) on the floor, dithered like GenieLamp's: a darker contact shadow hugging the bag's
// foot inside a wide, soft pool. The bag is a solid, so both are measured on the floor itself — out
// from the edges of its footprint, the same on every side — and wrap all the way round it, behind
// the gusset too, rather than sitting as one flat ellipse in front.
function floorShade(x: number, y: number) {
  const d = 2 * (ORIGIN[1] - y);
  const wx = x - ORIGIN[0] - 0.5 * d;
  const outX = Math.max(0, -wx, wx - WIDTH);
  const outD = Math.max(0, -d, d - DEPTH);
  const out = Math.sqrt(outX * outX + outD * outD);
  const pool = Math.max(0, 1 - out / 26);
  const contact = Math.max(0, 1 - out / 7);
  return 0.5 * pool + 0.3 * contact;
}

// How light (0–1) each face is: paper-white on the lit front, darkening a touch toward the floor;
// the gusset turned from the light; the opening a dark slot behind the rim.
function tone(hit: BagSurface) {
  const t = hit.t ?? 0;
  switch (hit.kind) {
    case "front":
      // Clean white above halfway, so the paper never turns into a grid of dots.
      return 1 - 0.8 * Math.max(0, 0.5 - t);
    case "side":
      return 0.34;
    default:
      // A dark slot: the hollow the rim opens onto.
      return 0.14 + 0.2 * t;
  }
}

function bagHits(sway: number) {
  return sampleGrid<BagSurface>([...BAG, handle(DEPTH, sway), handle(0, sway)], COLS, ROWS);
}

// The bag alone, its handles swung `sway` px.
function bagPath(sway: number) {
  const hits = bagHits(sway);
  return inkPath(COLS, ROWS, (row, col) => {
    const hit = hits[row][col];
    if (!hit) return false;
    // The handles are thin twisted cords, solid ink, so they read against paper, hollow and sky alike.
    if (hit.kind === "handle") return true;
    if (hit.edge) return true;
    const height = (hit.t ?? 0) * HEIGHT;
    // The rim's fold is a crisp line across the front and side.
    if (hit.kind !== "inside" && Math.abs(height - FOLD) < 0.9) return true;
    // The gusset's crease catches the light down the middle of the side.
    if (hit.kind === "side" && Math.abs((hit.s ?? 0) - 0.5) * DEPTH < 0.9) return false;
    return tone(hit) < bayerThreshold(row, col);
  });
}

// The floor round the bag as it stands. It stays put when the bag is lifted, so a gap opens beneath.
const RESTING_HITS = bagHits(0);
const FLOOR_PATH = inkPath(COLS, ROWS, (row, col) => !RESTING_HITS[row][col] && 1 - floorShade(col * CELL + 1, row * CELL + 1) < bayerThreshold(row, col));

// ── Motion ───────────────────────────────────────────────────────────────────

// Being set down: the bag drops the last few px to the floor, and the impact swings its handles —
// a damped sway, sampled at STEP_FPS — until they settle. Each step is [lift, sway] in px.
const SET_DOWN: [number, number][] = [
  [4, 0],
  [2, 0],
  [0, 1],
  [0, 2],
  [0, 2],
  [0, 0],
  [0, -1],
  [0, -1],
  [0, 0],
  [0, 0],
  [0, 1],
  [0, 0],
];
const STEP_FPS = 8;

const PATHS = new Map<number, string>();
const FRAMES = SET_DOWN.map(([lift, sway]) => {
  if (!PATHS.has(sway)) PATHS.set(sway, bagPath(sway));
  return { lift, path: PATHS.get(sway)! };
});
const RESTING = PATHS.get(0)!;

export default function EmptyBag({ className }: EmptyBagProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();

  const setDown = useSteppedSequence(
    svgRef,
    STEP_FPS,
    FRAMES.length,
    (step) => {
      const { lift, path } = FRAMES[step];
      pathRef.current?.setAttribute("d", path);
      pathRef.current?.setAttribute("transform", `translate(0 ${-lift})`);
    },
    !reduceMotion,
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      // A mouse over the bag picks it up and sets it down again.
      onPointerEnter={(event) => event.pointerType === "mouse" && setDown()}
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-22 w-30 text-neutral-900"}
    >
      <path d={FLOOR_PATH} />
      {/* Under reduced motion the bag stands still, and the key resets it if the setting turns on mid-drop. */}
      <path ref={pathRef} key={String(reduceMotion)} d={RESTING} />
    </svg>
  );
}
