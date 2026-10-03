"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type Part, type Surface, type Vec, bayerThreshold, brightness, ellipseFalloff, inkPath, isOutline, sampleGrid } from "@/lib/dither-art";

interface MoneyStackProps {
  className?: string;
}

// Three strapped bundles of banknotes in the stub-art style (see lib/dither-art) — the same lit,
// dithered, outlined drawing as GenieLamp. Each bundle is a box seen from above at 45°: the top
// note carries a printed border and a portrait seal, the front and side show the paper edges, and a
// paper strap wraps the middle. The stack rests on a dithered floor that fades out around it. Every
// few seconds a band of light sweeps across, like the foil on a ticket or a note catching the light,
// and glints off it in a pair of pixel sparkles.

const COLS = 60;
const ROWS = 24;
const FLOOR_ROWS = 7; // Below the layout box, so the stack itself stays centred; drawn unclipped.

// Face normals for a camera looking down about 26°; x right, y down, z toward the viewer.
const UP: Vec = [0, -0.9004471, 0.4349655];
const TOWARD: Vec = [0, 0.4349655, 0.9004471];
const RIGHT: Vec = [1, 0, 0];
const DEPTH = [0.5, -0.5]; // Screen offset per unit of depth.
const PAPER = 1.5; // Notes are white paper — brighter than the brass lamp under the same light.

type Texture = "note" | "front" | "side";
type FaceSurface = Surface & { u: number; v: number; texture: Texture };

// A parallelogram from corner a along edges e1 (u) and e2 (v), reporting where in it a point falls.
function face(a: [number, number], e1: [number, number], e2: [number, number], n: Vec, z: number, texture: Texture): Part<FaceSurface> {
  const det = e1[0] * e2[1] - e1[1] * e2[0];
  return (x, y) => {
    const px = x - a[0];
    const py = y - a[1];
    const u = (px * e2[1] - py * e2[0]) / det;
    const v = (e1[0] * py - e1[1] * px) / det;
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    return { z, n, u, v, texture };
  };
}

// A bundle with its front-bottom-left corner at (x, y): width w, depth d, height h. Higher bundles
// pass a higher z so they stand in front of the ones beneath.
function bundle(x: number, y: number, w: number, d: number, h: number, z: number) {
  const back: [number, number] = [DEPTH[0] * d, DEPTH[1] * d];
  return [
    face([x, y], [w, 0], [0, -h], TOWARD, z + 2, "front"),
    face([x + w, y], back, [0, -h], RIGHT, z, "side"),
    face([x, y - h], [w, 0], back, UP, z + 4, "note"),
  ];
}

// Centred in the 120 × 48 box with one cell of margin above and below.
const STACK = [...bundle(18, 46, 64, 28, 10, 0), ...bundle(23, 36, 64, 28, 10, 10), ...bundle(19, 26, 64, 28, 10, 20)];

const STRAP = [0.43, 0.55]; // Across each bundle, as a fraction of its width.

// A printed line (always inked), or the shade (0 dark – 1 light) the cell is dithered at.
function tone(hit: FaceSurface, row: number): true | number {
  const lit = brightness(hit.n) * PAPER;
  const { u, v } = hit;

  // The strap wraps the short way round, so it shows on the top and front only.
  if (hit.texture !== "side" && u > STRAP[0] && u < STRAP[1]) return u < STRAP[0] + 0.025 || u > STRAP[1] - 0.025 ? true : 1;

  if (hit.texture === "note") {
    const border = u > 0.04 && u < 0.96 && v > 0.15 && v < 0.85 && (u < 0.065 || u > 0.935 || v < 0.28 || v > 0.72);
    if (border) return true;
    const su = (u - 0.76) / 0.07;
    const sv = (v - 0.5) / 0.24;
    const shade = lit * (1.12 - 0.3 * u);
    return su * su + sv * sv < 1 ? shade * 0.2 : shade; // The portrait seal prints dark.
  }

  // Paper edges: a dithered line every other row with clean paper between, darker on the far side.
  if (hit.texture === "front") return row % 2 === 0 ? lit * (1.2 - 0.6 * u) : 1;
  return row % 2 ? lit * 1.6 : lit * 0.5;
}

const HITS = sampleGrid(STACK, COLS, ROWS + FLOOR_ROWS);

// How much shadow (0–1) falls on the floor at (x, y): a contact shadow hugging the bottom bundle's
// front and side edges, inside a soft pool that thins to scattered dots. The pool sits a little right
// of centre because the light comes from the upper left.
function floorShade(x: number, y: number) {
  const pool = ellipseFalloff(x, y, 60, 46, 62, 15);
  const front = y >= 46 && x > 16 && x < 84 ? Math.max(0, 1 - (y - 46) / 6) : 0;
  const pastSide = x - (82 + (46 - y)); // Distance right of the side face's bottom edge.
  const side = y >= 30 && y <= 48 && pastSide >= 0 ? Math.max(0, 1 - pastSide / 8) : 0;
  return 0.6 * pool + 0.35 * Math.max(front, side);
}

// ── Sheen ────────────────────────────────────────────────────────────────────

const SHEEN_FPS = 20;
const SHEEN_DELAY = 0.8; // s before the first sweep.
const SHEEN_SWEEP = 1.4; // s for the band to cross the stack…
const GLINT = 0.6; // …then the sparkles, staggered over this long…
const SHEEN_PERIOD = 4.5; // …once per period.
const SHEEN_HALF_WIDTH = 12; // px, measured across the band.
const SHEEN_FROM = 10; // Band position (x + y, in px) where a sweep starts and ends —
const SHEEN_TO = 170; // just clear of the stack at either end.

// Where the light glints: a large sparkle off the top right, a smaller one at the bottom left.
const SPARKLES = [
  { col: 54, row: 3, size: 3, delay: 0 },
  { col: 4, row: 19, size: 2, delay: 0.2 },
];

// The cells of a four-point sparkle (✦) with arms of `arm` cells; from three up its core fills out to 3×3.
function sparkleCells(col: number, row: number, arm: number) {
  const cells: [number, number][] = [[col, row]];
  for (let i = 1; i <= arm; i++) cells.push([col - i, row], [col + i, row], [col, row - i], [col, row + i]);
  if (arm >= 3) cells.push([col - 1, row - 1], [col + 1, row - 1], [col - 1, row + 1], [col + 1, row + 1]);
  return cells;
}

// The scene with the band `progress` (0–1) of the way across (null at rest), plus any sparkles.
function stackPath(progress: number | null, sparkles: [number, number][] = []) {
  const eased = progress === null ? 0 : progress * progress * (3 - 2 * progress);
  const band = SHEEN_FROM + (SHEEN_TO - SHEEN_FROM) * eased;
  // Each sparkle keeps a one-cell clearing in the floor so it stays crisp.
  const star = new Set(sparkles.map(([col, row]) => row * COLS + col));
  const clearing = new Set<number>();
  for (const [col, row] of sparkles) for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) clearing.add((row + dr) * COLS + col + dc);

  return inkPath(COLS, ROWS + FLOOR_ROWS, (row, col) => {
    if (star.has(row * COLS + col)) return true;
    // A diagonal band running bottom-left to top-right, sweeping left to right over the stack and the
    // floor alike. Printed lines and outlines stay put; the dithered shading washes out under it.
    const across = progress === null ? Infinity : Math.abs(col * 2 + 1 + (row * 2 + 1) - band);
    const light = 1.2 * Math.max(0, 1 - across / SHEEN_HALF_WIDTH);
    const threshold = bayerThreshold(row, col);
    const hit = HITS[row][col];
    if (!hit) return !clearing.has(row * COLS + col) && 1 - floorShade(col * 2 + 1, row * 2 + 1) + light < threshold;
    if (isOutline(HITS, row, col)) return true;
    const shade = tone(hit, row);
    return shade === true || shade + light < threshold;
  });
}

// The frame `seconds` into the loop, or null while the stack is at rest.
function sheenFrame(seconds: number) {
  if (seconds < SHEEN_DELAY) return null;
  const phase = (seconds - SHEEN_DELAY) % SHEEN_PERIOD;
  if (phase <= SHEEN_SWEEP) return stackPath(phase / SHEEN_SWEEP);
  const glint = phase - SHEEN_SWEEP;
  if (glint > GLINT) return null;
  const cells: [number, number][] = [];
  for (const { col, row, size, delay } of SPARKLES) {
    const t = (glint - delay) / (GLINT - 0.2);
    // Grows to full size and back: 1, 2, … size, … 2, 1.
    if (t > 0 && t < 1) cells.push(...sparkleCells(col, row, Math.ceil(size * (1 - Math.abs(2 * t - 1)))));
  }
  return cells.length ? stackPath(null, cells) : null;
}

const PATH = stackPath(null);

export default function MoneyStack({ className }: MoneyStackProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const resting = useRef(true);
  const reduceMotion = useReducedMotion();

  useSteppedFrames(
    svgRef,
    SHEEN_FPS,
    (seconds) => {
      const frame = sheenFrame(seconds);
      if (!frame && resting.current) return;
      resting.current = !frame;
      pathRef.current?.setAttribute("d", frame ?? PATH);
    },
    !reduceMotion,
  );

  // The box frames the stack alone so it centres on the notes; the floor spreads below it, unclipped.
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${COLS * 2} ${ROWS * 2}`}
      overflow="visible"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-12 w-30 text-neutral-900"}
    >
      <path ref={pathRef} d={PATH} />
    </svg>
  );
}
