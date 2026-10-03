"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type FaceSurface, type Part, type Surface, DITHER_CELL as CELL, bayerThreshold, brightness, ellipseFalloff, face, frontmost, inkPath, isOutline, oblique, sampleGrid } from "@/lib/dither-art";

interface EmptyBoxProps {
  className?: string;
}

// An open, empty cardboard box with a question mark floating over it, in the stub-art style (see
// lib/dither-art) — the same dithered, outlined drawing as EmptyBag and EmptyStorefront, in the
// cart's oblique view. Flat faces: a light front, a dark side, a dark hollow inside, and two flaps
// folded open. The question mark is a shaded tube, like the lamp's spout, and bobs gently over the
// box: whatever was meant to be here, isn't. It stands on the same tight floor shadow as the set.

const COLS = 60;
const ROWS = 44;

type Kind = "front" | "side" | "inside" | "flap-lit" | "flap-shade" | "mark";
type BoxSurface = Surface & Partial<Omit<FaceSurface<Kind>, keyof Surface>> & { kind: Kind };

// ── Box ──────────────────────────────────────────────────────────────────────

const project = oblique([36, 80]);
const WIDTH = 40;
const DEPTH = 20;
const HEIGHT = 26;

const BOX: Part<BoxSurface>[] = [
  face(project, [0, 0, 0], [WIDTH, 0, 0], [0, 0, HEIGHT], [0, 0, 1], "front", 0.5),
  face(project, [WIDTH, 0, 0], [0, DEPTH, 0], [0, 0, HEIGHT], [1, 0, 0.3], "side", 0.5),
  face(project, [0, 0, HEIGHT], [WIDTH, 0, 0], [0, DEPTH, 0], [0, -1, 0.4], "inside"),
  // The flaps, folded open: the back one stands up behind and the left one leans out.
  face(project, [0, DEPTH, HEIGHT], [WIDTH, 0, 0], [0, 4, 10], [0, 0, 1], "flap-shade", -0.5),
  face(project, [0, 0, HEIGHT], [0, DEPTH, 0], [-11, 0, 7], [-0.6, -0.8, 0.4], "flap-lit", 1),
];

// ── Question mark ────────────────────────────────────────────────────────────

const MARK_X = 58;
const MARK_Y = 14;
const MARK_TUBE = 2.1;

// The hook's path, in px from the mark's centre (y down), and the dot below it.
const HOOK: [number, number][] = [
  [-5.5, -3],
  [-5, -6],
  [-3, -8.6],
  [0, -9.6],
  [3, -8.8],
  [5, -6.6],
  [5.6, -3.6],
  [4.6, -1],
  [2.2, 1.2],
  [0.4, 3.4],
  [0, 5],
];
const DOT: [number, number] = [0, 12.5];

function sphere(cx: number, cy: number, r: number): Part<BoxSurface> {
  return (x, y) => {
    const u = (x - cx) / r;
    const v = (y - cy) / r;
    const s = 1 - u * u - v * v;
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    return { z: 30 + w * r, n: [u, v, w], kind: "mark" };
  };
}

// The mark, lifted `lift` px: the hook swept as a chain of beads, and the dot as one round bead.
function mark(lift: number): Part<BoxSurface>[] {
  const beads: Part<BoxSurface>[] = [];
  for (let i = 0; i < HOOK.length - 1; i++) {
    const [ax, ay] = HOOK[i];
    const [bx, by] = HOOK[i + 1];
    for (let step = 0; step < 6; step++) {
      const t = step / 6;
      beads.push(sphere(MARK_X + 1.15 * (ax + (bx - ax) * t), MARK_Y - lift + ay + (by - ay) * t, MARK_TUBE));
    }
  }
  beads.push(sphere(MARK_X + HOOK[HOOK.length - 1][0], MARK_Y - lift + HOOK[HOOK.length - 1][1], MARK_TUBE));
  const hook: Part<BoxSurface> = (x, y) => frontmost(beads, x, y);
  return [hook, sphere(MARK_X + DOT[0], MARK_Y - lift + DOT[1], MARK_TUBE + 0.4)];
}

// ── Drawing ──────────────────────────────────────────────────────────────────

// Shadow (0–1) on the floor: a tight pool round the base, set a little right because the light comes
// from the upper left.
function floorShade(x: number, y: number) {
  return Math.min(1, 1.3 * ellipseFalloff(x, y, 64, 82, 32, 4.5));
}

// How light (0–1) each face is: the front pale card darkening toward the floor, the side turned from
// the light, the hollow dark, and the flaps lit or shaded by which way they lean.
function tone(hit: BoxSurface) {
  const t = hit.t ?? 0;
  switch (hit.kind) {
    case "front":
      return 1 - 0.8 * Math.max(0, 0.5 - t);
    case "side":
      return 0.32;
    case "inside":
      return 0.14 + 0.18 * t;
    case "flap-lit":
      return 0.96;
    default:
      // The back flap's inner face, in the box's shade.
      return 0.7;
  }
}

function boxPath(lift: number) {
  const hits = sampleGrid<BoxSurface>([...BOX, ...mark(lift)], COLS, ROWS);
  return inkPath(COLS, ROWS, (row, col) => {
    const hit = hits[row][col];
    const threshold = bayerThreshold(row, col);
    if (!hit) return 1 - floorShade(col * CELL + 1, row * CELL + 1) < threshold;
    if (hit.kind === "mark") return isOutline(hits, row, col) || brightness(hit.n) * 1.25 < threshold;
    return !!hit.edge || tone(hit) < threshold;
  });
}

// ── Motion ───────────────────────────────────────────────────────────────────

// The mark floats up a cell, holds, and settles back.
const LIFT = [0, 0, 0, 2, 2, 2, 2, 0];
const STEP_FPS = 4;

const PATHS = new Map<number, string>();
const FRAMES = LIFT.map((lift) => {
  if (!PATHS.has(lift)) PATHS.set(lift, boxPath(lift));
  return PATHS.get(lift)!;
});

export default function EmptyBox({ className }: EmptyBoxProps) {
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
      {/* Under reduced motion the mark holds still, and the key resets it if the setting turns on mid-float. */}
      <path ref={pathRef} key={String(reduceMotion)} d={FRAMES[0]} />
    </svg>
  );
}
