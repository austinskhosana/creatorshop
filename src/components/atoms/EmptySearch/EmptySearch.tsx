"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type Hit, type Part, type Surface, DITHER_CELL as CELL, bayerThreshold, brightness, ellipseFalloff, inkPath, isOutline, sampleGrid } from "@/lib/dither-art";

interface EmptySearchProps {
  className?: string;
}

// A magnifying glass in the stub-art style (see lib/dither-art) — the same lit, dithered, outlined
// drawing as GenieLamp, EmptyCart and EmptyChat. A shaded metal ring holds a clear lens with a curved
// glint across its upper left; a short ferrule joins it to a darker grip. It floats over the same
// tight floor shadow as EmptyChat and keeps searching the way you would: it holds still to look,
// lifts, moves to a new spot, lowers and looks again — centre, right, left — its shadow following
// beneath it and softening while it's lifted.

const COLS = 60;
const ROWS = 44;

type Kind = "metal" | "grip" | "lens";
type GlassSurface = Surface & { kind: Kind; lx?: number; ly?: number };

// ── Glass ────────────────────────────────────────────────────────────────────

const LENS_X = 45;
const LENS_Y = 31;
const RING = 21; // Radius to the middle of the ring's tube.
const TUBE = 3.5;
const LENS = RING - TUBE * 0.5; // The lens tucks under the ring.

// A round bar from a to b, shaded across its width. The near end is a full hemisphere; the far end
// is squashed to `endCap` of the radius, so 1 rounds it off fully and smaller values flatten it to a
// blunt end with rounded corners.
function bar(a: [number, number], b: [number, number], r: number, kind: Kind, endCap = 1): Part<GlassSurface> {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  const ax = dx / length;
  const ay = dy / length;
  return (x, y) => {
    const along = (x - a[0]) * ax + (y - a[1]) * ay; // px from a, along the bar.
    const cap = along > length ? endCap : 1;
    const past = along < 0 ? along : along > length ? along - length : 0;
    const ex = x - (a[0] + ax * (along - past)); // Offset from the axis point, past included.
    const ey = y - (a[1] + ay * (along - past));
    const px = ax * past;
    const py = ay * past;
    // Across the bar, plus the squashed distance past an end.
    const cx = ex - px;
    const cy = ey - py;
    const u = past / (cap * r);
    const s = 1 - (cx * cx + cy * cy) / (r * r) - u * u;
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    return { z: 4 + w * r, n: [cx / r + (ax * u) / cap, cy / r + (ay * u) / cap, w], kind };
  };
}

// The ring: a tube swept round the lens.
function ring(cx: number, cy: number): Part<GlassSurface> {
  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d === 0) return null;
    const e = d - RING;
    const s = 1 - (e * e) / (TUBE * TUBE);
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    // A flattened profile, like a bezel, so the inner edge stays light rather than ringing the lens in shadow.
    return { z: 4 + w * TUBE, n: [(0.6 * (dx / d) * e) / TUBE, (0.6 * (dy / d) * e) / TUBE, w], kind: "metal" };
  };
}

// The lens: a low disc behind the ring, carrying its position so it can be shaded as glass.
function lens(cx: number, cy: number): Part<GlassSurface> {
  return (x, y) => {
    const lx = (x - cx) / LENS;
    const ly = (y - cy) / LENS;
    if (lx * lx + ly * ly >= 1) return null;
    return { z: 3, n: [0, 0, 1], kind: "lens", lx, ly };
  };
}

// The handle leaves the ring at 45° down and to the right: a short metal ferrule, then the grip.
const DIAGONAL = Math.sqrt(0.5);
function along(cx: number, cy: number, distance: number): [number, number] {
  return [cx + distance * DIAGONAL, cy + distance * DIAGONAL];
}

function glass(ox: number, oy: number): Part<GlassSurface>[] {
  const cx = LENS_X + ox;
  const cy = LENS_Y + oy;
  return [
    lens(cx, cy),
    ring(cx, cy),
    bar(along(cx, cy, RING + TUBE - 2), along(cx, cy, RING + TUBE + 5), 4.6, "metal"),
    bar(along(cx, cy, RING + TUBE + 9), along(cx, cy, RING + TUBE + 27), 5.8, "grip", 0.45),
  ];
}

// The glass is clear, bar a curved glint across its upper left, set in from the ring so it reads as
// a reflection on the lens rather than an edge of the rim.
function onGlint(lx: number, ly: number) {
  const r = Math.sqrt(lx * lx + ly * ly);
  return r > 0.44 && r < 0.56 && lx < -0.06 && ly < -0.06;
}

// ── Floor ────────────────────────────────────────────────────────────────────

// Shadow (0–1) beneath the floating glass: a tight pool set a little right, because the light comes
// from the upper left — dense in the middle so it reads as a shadow, not a line. It follows the
// glass across, and softens while the glass is lifted.
function floorShade(x: number, y: number, ox: number, lifted: boolean) {
  return Math.min(1, (lifted ? 0.95 : 1.3) * ellipseFalloff(x, y, 63 + ox, 82, 32, 4.5));
}

function glassPath(ox: number, oy: number) {
  const hits = sampleGrid<GlassSurface>(glass(ox, oy), COLS, ROWS);
  return inkPath(COLS, ROWS, (row, col) => {
    const hit = hits[row][col];
    const threshold = bayerThreshold(row, col);
    if (!hit) return 1 - floorShade(col * CELL + 1, row * CELL + 1, ox, oy < 0) < threshold;
    if (hit.kind === "lens") {
      // Outlined where it meets the ring, so the rim has an inside edge.
      return isOutline(hits as (Hit | null)[][], row, col) || onGlint(hit.lx ?? 0, hit.ly ?? 0);
    }
    if (isOutline(hits as (Hit | null)[][], row, col)) return true;
    // The grip is darker stuff than the metal, so the handle reads as a separate piece.
    return brightness(hit.n) * (hit.kind === "grip" ? 0.4 : 1.45) < threshold;
  });
}

// ── Motion ───────────────────────────────────────────────────────────────────

// Searching: hold still over a spot to look, lift a cell, glide to the next spot, lower, look again.
// Each step is [x, y] in px; moves go a cell at a time.
const STOPS = [0, 6, -6]; // Centre, right, left, and round again.
const LOOK = 10; // Steps spent looking at each stop.
const LIFT = 2;

const SEARCH: [number, number][] = STOPS.flatMap((from, index) => {
  const to = STOPS[(index + 1) % STOPS.length];
  const steps: [number, number][] = Array.from({ length: LOOK }, () => [from, 0] as [number, number]);
  const direction = to > from ? CELL : -CELL;
  for (let x = from; x !== to; x += direction) steps.push([x, -LIFT]);
  steps.push([to, -LIFT]);
  return steps;
});
const STEP_FPS = 8;

const PATHS = new Map<string, string>();
const FRAMES = SEARCH.map(([ox, oy]) => {
  const key = `${ox},${oy}`;
  if (!PATHS.has(key)) PATHS.set(key, glassPath(ox, oy));
  return PATHS.get(key)!;
});

export default function EmptySearch({ className }: EmptySearchProps) {
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
      {/* Under reduced motion the glass rests, and the key resets it if the setting turns on mid-loop. */}
      <path ref={pathRef} key={String(reduceMotion)} d={FRAMES[0]} />
    </svg>
  );
}
