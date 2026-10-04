"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type Hit, type Part, type Surface, DITHER_CELL as CELL, bayerThreshold, brightness, ellipseFalloff, inkPath, isOutline, sampleGrid } from "@/lib/dither-art";

interface EmptyCompassProps {
  className?: string;
}

// A pocket compass in the stub-art style (see lib/dither-art) — the same lit, dithered, outlined
// drawing as EmptySearch, whose ring it shares. A shaded metal case with a loop on top holds a pale
// dial ticked at the eight points; a faceted needle, dark to the north and pale to the south, turns
// on a bright pin. It can't find its bearings: it whirls, wobbles to a stop pointing somewhere wrong,
// then whirls off again. All the while it hovers, rising and settling over the same tight floor shadow
// as the set, which thins out as the compass lifts away from it.

const COLS = 60;
const ROWS = 44;

type Kind = "metal" | "dial" | "north" | "south" | "pin";
type CompassSurface = Surface & { kind: Kind; shade?: number; tick?: boolean };

// ── Case ─────────────────────────────────────────────────────────────────────

const CX = 59;
const CY = 43;
const RING = 24; // Radius to the middle of the case's tube.
const TUBE = 3.2;
const DIAL = RING - TUBE * 0.5; // The dial tucks under the case.
const LOOP_Y = CY - RING - TUBE - 3;
const LOOP = 4.5;
const LOOP_TUBE = 1.8;

// A tube swept round a centre: the case's rim, and the loop it hangs from.
function ring(cx: number, cy: number, radius: number, tube: number, base: number): Part<CompassSurface> {
  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d === 0) return null;
    const e = d - radius;
    const s = 1 - (e * e) / (tube * tube);
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    // A flattened profile, like EmptySearch's bezel, so the inner edge stays light.
    return { z: base + w * tube, n: [(0.6 * (dx / d) * e) / tube, (0.6 * (dy / d) * e) / tube, w], kind: "metal" };
  };
}

// Unit directions to the 16 points, clockwise from north (y down) — written with sqrt only, so server
// and client build the identical path.
const C22 = Math.sqrt(2 + Math.SQRT2) / 2;
const S22 = Math.sqrt(2 - Math.SQRT2) / 2;
const C45 = Math.SQRT1_2;
const QUARTER: [number, number][] = [
  [0, -1],
  [S22, -C22],
  [C45, -C45],
  [C22, -S22],
];
const POINTS: [number, number][] = [0, 1, 2, 3].flatMap((turn) =>
  QUARTER.map(([x, y]): [number, number] => {
    // Each quarter turn clockwise maps (x, y) to (−y, x).
    let point: [number, number] = [x, y];
    for (let i = 0; i < turn; i++) point = [-point[1], point[0]];
    return point;
  }),
);

// Ticks just inside the rim at the eight points; the cardinal ones run longer.
function onTick(dx: number, dy: number, r: number) {
  for (let i = 0; i < 16; i += 2) {
    const [px, py] = POINTS[i];
    const along = dx * px + dy * py;
    const across = Math.abs(dx * py - dy * px);
    const inner = i % 4 === 0 ? DIAL - 6 : DIAL - 3.5;
    if (across < 1.1 && along > inner && r < DIAL - 1.5) return true;
  }
  return false;
}

const dial: Part<CompassSurface> = (x, y) => {
  const dx = x - CX;
  const dy = y - CY;
  const r = Math.sqrt(dx * dx + dy * dy);
  if (r >= DIAL) return null;
  // The rim stands over the dial and shades its upper-left edge, away from the light.
  const toward = r === 0 ? 0 : Math.max(0, -(dx + dy) / (r * Math.SQRT2));
  const shade = Math.max(0, r / DIAL - 0.8) * 5 * toward;
  return { z: 3, n: [0, 0, 1], kind: "dial", shade, tick: onTick(dx, dy, r) };
};

// ── Needle ───────────────────────────────────────────────────────────────────

const NEEDLE = 17.5; // From the pin to each tip.
const NEEDLE_WIDTH = 5; // Half its width at the pin.
const PIN = 2.4;

// A flat diamond with a raised spine, so one facet catches the light and the other falls away.
function needle([px, py]: [number, number]): Part<CompassSurface> {
  return (x, y) => {
    const dx = x - CX;
    const dy = y - CY;
    const along = dx * px + dy * py;
    const across = dx * -py + dy * px;
    const half = NEEDLE_WIDTH * (1 - Math.abs(along) / NEEDLE);
    if (half <= 0 || Math.abs(across) > half) return null;
    const side = across < 0 ? -1 : 1;
    // The facet's normal tips out across the needle, toward the side it's on.
    const nx = 0.3 * side * -py;
    const ny = 0.3 * side * px;
    return { z: 5.5, n: [nx, ny, 1], kind: along > 0 ? "north" : "south" };
  };
}

const pin: Part<CompassSurface> = (x, y) => {
  const u = (x - CX) / PIN;
  const v = (y - CY) / PIN;
  const s = 1 - u * u - v * v;
  if (s <= 0) return null;
  const w = Math.sqrt(s);
  return { z: 7 + w * PIN, n: [u, v, w], kind: "pin" };
};

// ── Drawing ──────────────────────────────────────────────────────────────────

// Shadow (0–1) beneath the floating compass: a tight pool set a little right, because the light comes
// from the upper left. It shrinks and fades as the compass rises `lift` px.
function floorShade(x: number, y: number, lift: number) {
  return Math.min(1, (1.3 - 0.06 * lift) * ellipseFalloff(x, y, 64, 82, 32 - lift, 4.5 - 0.15 * lift));
}

const CASE = [ring(CX, LOOP_Y, LOOP, LOOP_TUBE, 0), ring(CX, CY, RING, TUBE, 4), dial, pin];

// The compass with its needle on `point`, raised `lift` px.
function compassPath(point: number, lift: number) {
  const parts = [...CASE, needle(POINTS[point])].map((part): Part<CompassSurface> => (x, y) => part(x, y + lift));
  const hits = sampleGrid<CompassSurface>(parts, COLS, ROWS);
  return inkPath(COLS, ROWS, (row, col) => {
    const hit = hits[row][col];
    const threshold = bayerThreshold(row, col);
    if (!hit) return 1 - floorShade(col * CELL + 1, row * CELL + 1, lift) < threshold;
    const outline = isOutline(hits as (Hit | null)[][], row, col);
    switch (hit.kind) {
      case "dial":
        return outline || !!hit.tick || 1 - 0.7 * (hit.shade ?? 0) < threshold;
      // The north half is dark metal with a glint along its lit facet; the south half is pale.
      case "north":
        return outline || brightness(hit.n) * 0.35 < threshold;
      case "south":
        return outline || brightness(hit.n) * 3 < threshold;
      default:
        return outline || brightness(hit.n) * 1.45 < threshold;
    }
  });
}

// ── Motion ───────────────────────────────────────────────────────────────────

// Which of the 16 points the needle shows at each step: a whirl, a wobble to rest somewhere wrong, a
// long hold, a swing back the other way to another wrong rest, and back to just off north.
const HEADINGS = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  4, 7, 10, 13, 0, 3, 6, 8, 9, 8, 9, 9,
  9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  7, 4, 1, 14, 13, 14, 13, 13,
  13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
  15, 2, 0, 1,
];
// The hover, in px at each step: an eased rise of two cells, a hold, and an eased settle. Its 20 steps
// divide the needle's 60, so the two loops line up and every frame can be built up front.
const LIFT = [0, 0, 0, 0, 2, 2, 2, 4, 4, 4, 4, 4, 4, 2, 2, 2, 0, 0, 0, 0];
const STEP_FPS = 8;

const PATHS = new Map<string, string>();
const FRAMES = HEADINGS.map((point, index) => {
  const lift = LIFT[index % LIFT.length];
  const key = `${point},${lift}`;
  if (!PATHS.has(key)) PATHS.set(key, compassPath(point, lift));
  return PATHS.get(key)!;
});

export default function EmptyCompass({ className }: EmptyCompassProps) {
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
      {/* Under reduced motion the needle rests off north, and the key resets it if the setting turns on mid-whirl. */}
      <path ref={pathRef} key={String(reduceMotion)} d={FRAMES[0]} />
    </svg>
  );
}
