"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { DITHER_CELL as CELL, inkPath } from "@/lib/dither-art";

interface EmptyEnvelopeProps {
  className?: string;
}

// An open, empty envelope in the stub-art style (see lib/dither-art), seen from the back: a solid
// black hollow down to a V, the bottom flap's folds rising to meet the V's point, and the flap folded
// open behind to show a striped liner. Unlike the rest of the set it's drawn straight onto the cell
// grid rather than sampled from shapes, so every diagonal is an exact two-across, one-down staircase:
// the flap and the V mirror each other into one diamond, and the folds run parallel to both. Every so
// often a pixel moth flutters up out of the hollow and away — there's nothing in here yet. It floats
// over the same tight floor shadow as the set, with a little more air beneath it.

const COLS = 60;
const ROWS = 44;

// ── Envelope ─────────────────────────────────────────────────────────────────

// In cells. Forty columns across, centred on the canvas.
const LEFT = 10;
const RIGHT = 49;
const HINGE = 14; // The row the flap folds back along, and the top of the body.
const DEPTH = 10; // How many rows the V, the flap and the bottom flap's point each reach.
const BOTTOM = HINGE + 2 * DEPTH; // So the V's point lands exactly where the folds meet.

// Rows a diagonal has climbed by this column: 0 at the sides, DEPTH at the two middle columns,
// rising one row every two columns.
function climb(col: number) {
  return Math.floor((Math.min(col - LEFT, RIGHT - col) + 1) / 2);
}

// ── Shadow ───────────────────────────────────────────────────────────────────

// The floor shadow, drawn on the grid like the letter and centred under it: a dense bar, rows either
// side that taper through an even checker, and a scatter of dots on the outermost rows. Each row is
// [solid, reach] in columns out from the middle; a little narrower than the letter, as it floats.
const SHADOW_ROW = 41;
const SHADOW: Record<number, [solid: number, reach: number]> = {
  [-2]: [0, 9],
  [-1]: [4, 13],
  0: [9, 17],
  1: [4, 13],
  2: [0, 9],
};

function shadowInk(row: number, col: number) {
  const tier = SHADOW[row - SHADOW_ROW];
  if (!tier) return false;
  const [solid, reach] = tier;
  // Columns out from the middle pair, so the left and right halves mirror exactly.
  const out = col < (LEFT + RIGHT + 1) / 2 ? (LEFT + RIGHT - 1) / 2 - col : col - (LEFT + RIGHT + 1) / 2;
  // The dense middle drops every fourth cell, staggered row to row, so it reads as deep shade, not solid ink.
  if (out < solid) return (out + 2 * (row % 2)) % 4 !== 3;
  if (out >= reach) return false;
  // The outermost rows thin to every third cell, which spaces evenly across the middle; the rest alternate.
  return Math.abs(row - SHADOW_ROW) === 2 ? out % 3 === 1 : (out + row) % 2 === 0;
}

function envelopeInk(row: number, col: number) {
  if (col >= LEFT && col <= RIGHT) {
    const rise = climb(col);
    // The body: its outline, the hollow solid down to the V, and the bottom flap's two folds.
    if (row >= HINGE && row <= BOTTOM) {
      return col === LEFT || col === RIGHT || row === BOTTOM || row <= HINGE + rise || row === BOTTOM - rise;
    }
    // The flap: its edge mirrors the V above the hinge. The liner is chevrons nested inside it, each
    // parallel to the edge, stopping a clear row short of the hinge.
    if (row < HINGE && row >= HINGE - rise) {
      const fromEdge = row - (HINGE - rise);
      return fromEdge === 0 || (fromEdge % 3 === 0 && row < HINGE - 1);
    }
  }
  return shadowInk(row, col);
}

// ── Moth ─────────────────────────────────────────────────────────────────────

// A hand-placed sprite, in cells round its body: wings raised, then wings spread low.
const WINGS_UP = ["#.#.#", ".###.", "..#.."];
const WINGS_DOWN = [".....", "#####", ".#.#."];

function spriteCells(sprite: string[], col: number, row: number) {
  const cells: [number, number][] = [];
  sprite.forEach((line, dy) => {
    [...line].forEach((cell, dx) => {
      if (cell === "#") cells.push([row + dy - 1, col + dx - 2]);
    });
  });
  // Clipped to the canvas, so a moth leaving off the edge doesn't wrap round to the next row.
  return cells.filter(([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS);
}

// Its flight, in cells: up out of the hollow, then away over the flap's right shoulder, lurching as it goes.
const FLIGHT: [number, number][] = [
  [30, 21],
  [30, 19],
  [31, 17],
  [32, 15],
  [33, 13],
  [35, 12],
  [37, 10],
  [38, 8],
  [40, 7],
  [42, 6],
  [43, 4],
  [45, 3],
  [47, 2],
  [49, 1],
  [51, 0],
  [53, -1],
  [55, -2],
  [57, -3],
];
const WAIT = 22; // Steps with no moth, between flights.

function drawingPath(moth: [number, number][] | null) {
  if (!moth) return inkPath(COLS, ROWS, envelopeInk);
  const key = (row: number, col: number) => row * (COLS + 2) + col;
  const body = new Set(moth.map(([row, col]) => key(row, col)));
  // A clear cell round the moth keeps it readable over the hollow and the flap.
  const halo = new Set<number>();
  for (const [row, col] of moth) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) halo.add(key(row + dr, col + dc));
  }
  return inkPath(COLS, ROWS, (row, col) => body.has(key(row, col)) || (!halo.has(key(row, col)) && envelopeInk(row, col)));
}

// ── Motion ───────────────────────────────────────────────────────────────────

const STEP_FPS = 8;
const RESTING = drawingPath(null);
const FRAMES = [
  ...Array.from({ length: WAIT }, () => RESTING),
  ...FLIGHT.map(([col, row], index) => drawingPath(spriteCells(index % 2 ? WINGS_DOWN : WINGS_UP, col, row))),
];

export default function EmptyEnvelope({ className }: EmptyEnvelopeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();

  useSteppedFrames(svgRef, STEP_FPS, (seconds) => pathRef.current?.setAttribute("d", FRAMES[Math.floor(seconds * STEP_FPS) % FRAMES.length]), !reduceMotion);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-22 w-30 text-neutral-900"}
    >
      {/* Under reduced motion the moth stays put inside, and the key resets it if the setting turns on mid-flight. */}
      <path ref={pathRef} key={String(reduceMotion)} d={RESTING} />
    </svg>
  );
}
