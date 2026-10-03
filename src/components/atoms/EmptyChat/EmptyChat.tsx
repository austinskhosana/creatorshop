"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type Hit, type Part, type Surface, type Vec, DITHER_CELL as CELL, bayerThreshold, brightness, ellipseFalloff, inkPath, isOutline, sampleGrid } from "@/lib/dither-art";

interface EmptyChatProps {
  className?: string;
}

// A speech bubble in the stub-art style (see lib/dither-art) — the same lit, dithered, outlined
// drawing as GenieLamp and EmptyCart. The bubble is one inflated surface: a rounded oval with a
// curling tail blended out of its lower left, the tail thinning and flattening as it goes so the
// light rolls along it the way it rolls over the dome. Three ink beads on its face draw out an
// ellipsis a dot at a time and let it hang — nobody has said anything yet, so the thread is waiting
// on you. It floats over a soft dithered shadow.

const COLS = 60;
const ROWS = 44;

// ── Bubble ───────────────────────────────────────────────────────────────────

const CX = 63;
const CY = 31;
const RX = 46;
const RY = 28;
const HEIGHT = 20; // How far the middle of the dome stands off the page.
const ALBEDO = 1.6; // The bubble is paper, lighter than the lamp's brass, so its face reads white.

// The tail curls from inside the bubble down and out to the left, thinning and flattening to a tip.
const TAIL: [number, number][] = [
  [42, 46],
  [36, 64],
  [19, 71],
];
const TAIL_WIDTH = [12, 2.4];
const TAIL_HEIGHT = [12, 3];

// Points along the tail's curve, for finding the nearest one.
const TAIL_STEPS = 32;
const TAIL_POINTS = Array.from({ length: TAIL_STEPS + 1 }, (_, i) => {
  const t = i / TAIL_STEPS;
  const a = (1 - t) * (1 - t);
  const b = 2 * (1 - t) * t;
  const c = t * t;
  return [a * TAIL[0][0] + b * TAIL[1][0] + c * TAIL[2][0], a * TAIL[0][1] + b * TAIL[1][1] + c * TAIL[2][1], t];
});

const BLEND = 0.4; // How softly the tail grows out of the bubble.

// The surface's height. Each shape has a field that is 0 along its spine and 1 on its outline; the
// two are blended with a smooth minimum, and the height scale slides from the dome's to the tail's
// across the same blend, so the join is one continuous surface.
function height(x: number, y: number) {
  const u = Math.abs(x - CX) / RX;
  const v = Math.abs(y - CY) / RY;
  const bubble = u * u * Math.sqrt(u) + v * v * Math.sqrt(v); // A full oval, a touch squarer than an ellipse.

  let nearest = Infinity;
  let t = 0;
  for (const [px, py, pt] of TAIL_POINTS) {
    const d = (x - px) * (x - px) + (y - py) * (y - py);
    if (d < nearest) {
      nearest = d;
      t = pt;
    }
  }
  const width = TAIL_WIDTH[0] + (TAIL_WIDTH[1] - TAIL_WIDTH[0]) * t;
  const tail = nearest / (width * width);

  const h = Math.max(BLEND - Math.abs(bubble - tail), 0) / BLEND;
  const field = Math.min(bubble, tail) - (h * h * BLEND) / 4;
  if (field >= 1) return 0;
  const toTail = Math.max(0, Math.min(1, 0.5 + (bubble - tail) / (2 * BLEND)));
  const scale = HEIGHT + (TAIL_HEIGHT[0] + (TAIL_HEIGHT[1] - TAIL_HEIGHT[0]) * t - HEIGHT) * toTail;
  return scale * Math.sqrt(1 - field);
}

// Sampled once, with the slope by central differences.
const BUBBLE_HITS = sampleGrid<Surface>(
  [
    (x, y) => {
      const z = height(x, y);
      if (z <= 0) return null;
      const e = 0.5;
      const n: Vec = [(height(x - e, y) - height(x + e, y)) / (2 * e), (height(x, y - e) - height(x, y + e)) / (2 * e), 1];
      return { z, n };
    },
  ],
  COLS,
  ROWS,
);

const bubble: Part = (x, y) => BUBBLE_HITS[Math.floor(y / CELL)]?.[Math.floor(x / CELL)] ?? null;

// ── Typing dots ──────────────────────────────────────────────────────────────

type DotSurface = Surface & { glint?: boolean };

// Centred on cells, so each dot is an odd number of cells across and comes out round.
const DOT_Y = 31;
const DOT_XS = [47, 63, 79];
const DOT_RADIUS = 4.5;

// A dot of the ellipsis: a bead of ink standing proud of the face, with a one-cell glint where it catches the
// light. It sits above the dome's highest point, so the slope never clips its uphill side.
function dot(cx: number, cy: number): Part<DotSurface> {
  return (x, y) => {
    const u = (x - cx) / DOT_RADIUS;
    const v = (y - cy) / DOT_RADIUS;
    const s = 1 - u * u - v * v;
    if (s <= 0) return null;
    const gu = u + 0.32;
    const gv = v + 0.36;
    return { z: HEIGHT + 1 + Math.sqrt(s), n: [u, v, 1], glint: gu * gu + gv * gv < 0.05 };
  };
}

// Shadow (0–1) on the floor below the floating bubble: a tight pool set a little right, because
// the light comes from the upper left — dense in the middle so it reads as a shadow, not a line.
function floorShade(x: number, y: number) {
  return Math.min(1, 1.3 * ellipseFalloff(x, y, 68, 81, 34, 4.5));
}

function nextToDot(hits: (Hit<DotSurface> | null)[][], row: number, col: number) {
  return [hits[row][col + 1], hits[row][col - 1], hits[row + 1]?.[col], hits[row - 1]?.[col]].some((n) => n && n.part > 0);
}

// The drawing with the first `shown` dots of the ellipsis drawn.
function bubblePath(shown: number) {
  const dots = DOT_XS.slice(0, shown).map((x) => dot(x, DOT_Y));
  const hits = sampleGrid<DotSurface>([bubble, ...dots], COLS, ROWS);
  return inkPath(COLS, ROWS, (row, col) => {
    const hit = hits[row][col];
    const threshold = bayerThreshold(row, col);
    if (!hit) return 1 - floorShade(col * CELL + 1, row * CELL + 1) < threshold;
    if (hit.part > 0) return !hit.glint;
    // A clear cell round each dot keeps it crisp against the face.
    if (nextToDot(hits, row, col)) return false;
    return isOutline(hits, row, col) || brightness(hit.n) * ALBEDO < threshold;
  });
}

// ── Motion ───────────────────────────────────────────────────────────────────

// An ellipsis drawn out a dot at a time and left to hang — a pause in a conversation that's waiting
// on you — then cleared and drawn again. Not a typing wave: nobody on the other end is typing.
const SHOWN = [3, 3, 3, 3, 3, 0, 1, 2];
const STEP_FPS = 2.5;

const PATHS = [0, 1, 2, 3].map(bubblePath);
const RESTING = PATHS[3];

export default function EmptyChat({ className }: EmptyChatProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();

  useSteppedFrames(svgRef, STEP_FPS, (seconds) => pathRef.current?.setAttribute("d", PATHS[SHOWN[Math.floor(seconds * STEP_FPS) % SHOWN.length]]), !reduceMotion);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-22 w-30 text-neutral-900"}
    >
      {/* Under reduced motion the full ellipsis holds, and the key resets it if the setting turns on mid-draw. */}
      <path ref={pathRef} key={String(reduceMotion)} d={RESTING} />
    </svg>
  );
}
