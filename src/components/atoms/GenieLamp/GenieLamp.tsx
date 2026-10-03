"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type Part, DITHER_CELL as CELL, bayerThreshold, brightness, ellipseFalloff, frontmost, inkPath, isOutline, sampleGrid } from "@/lib/dither-art";

interface GenieLampProps {
  className?: string;
}

// A genie lamp in the stub-art style (see lib/dither-art): shaded solids — ellipsoids, a swept
// spout, a ring handle — dithered to pure black and white with an ink outline. A wisp of smoke,
// dithered the same way, rises from the spout once the component mounts, and the lamp stands on a
// dithered floor shadow that fades out around it — the same floor as MoneyStack's.

const COLS = 60;
const LAMP_ROWS = 30;
const SMOKE_ROWS = 12; // Headroom above the lamp for the wisp — drawn outside the layout box.
const FLOOR_ROWS = 7; // Room below the lamp for its floor shadow — also outside the layout box.
const ROWS = SMOKE_ROWS + LAMP_ROWS;

// ── Lamp ─────────────────────────────────────────────────────────────────────

function ellipsoid(cx: number, cy: number, rx: number, ry: number, rz: number, z0 = 0): Part {
  return (x, y) => {
    const u = (x - cx) / rx;
    const v = (y - cy) / ry;
    const s = 1 - u * u - v * v;
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    return { z: z0 + w * rz, n: [u / rx, v / ry, w / rz] };
  };
}

function sphere(cx: number, cy: number, r: number): Part {
  return ellipsoid(cx, cy, r, r, r);
}

// A tube along a quadratic curve, tapering from r0 to r1 — swept as a chain of spheres.
function spout(p0: [number, number], p1: [number, number], p2: [number, number], r0: number, r1: number): Part {
  const beads: Part[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    beads.push(sphere(a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1], r0 + (r1 - r0) * t));
  }
  return (x, y) => frontmost(beads, x, y);
}

// The handle: the part of a ring (radius R, tube radius r) left of maxX.
function ring(cx: number, cy: number, R: number, r: number, maxX: number): Part {
  return (x, y) => {
    if (x > maxX) return null;
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d === 0) return null;
    return sphere(cx + (dx / d) * R, cy + (dy / d) * R, r)(x, y);
  };
}

// Authored in lamp space: 120 × 60 px, origin at the lamp's top-left.
const LAMP: Part[] = [
  ellipsoid(52, 55, 15, 3.2, 15), // base plate
  ellipsoid(52, 49, 8, 5, 8), // foot
  ellipsoid(52, 35.5, 30, 13, 26), // body
  spout([74, 35], [97, 35], [116, 17], 7, 2),
  ring(17, 31, 9, 2.3, 25), // handle
  ellipsoid(50, 24.5, 13, 3.5, 13, 1), // collar
  ellipsoid(50, 20, 9.5, 6, 9.5), // lid
  ellipsoid(50, 14.5, 1.8, 3, 1.8), // knob stem
  sphere(50, 10.5, 3.4), // knob
];

const LAMP_HITS = sampleGrid(LAMP, COLS, LAMP_ROWS + FLOOR_ROWS);

// How much shadow (0–1) falls on the floor at (x, y), in lamp space: a contact shadow round the base
// plate inside a soft pool cast by the body, set a little right because the light comes from the
// upper left. The far side fades out behind the base so no dots float up under the body.
function floorShade(x: number, y: number) {
  const pool = ellipseFalloff(x, y, 60, 59, 58, 13);
  const contact = ellipseFalloff(x, y, 53, 58.5, 20, 5);
  const near = Math.min(1, Math.max(0, (y - 51) / 6));
  return near * (0.5 * pool + 0.3 * contact);
}

const LAMP_PATH = inkPath(
  COLS,
  LAMP_ROWS + FLOOR_ROWS,
  (row, col) => {
    const hit = LAMP_HITS[row][col];
    const threshold = bayerThreshold(SMOKE_ROWS + row, col);
    if (!hit) return 1 - floorShade(col * CELL + 1, row * CELL + 1) < threshold;
    return isOutline(LAMP_HITS, row, col) || brightness(hit.n) < threshold;
  },
  SMOKE_ROWS,
);

// ── Smoke ────────────────────────────────────────────────────────────────────

const TIP_X = 115; // Spout opening, in component space.
const TIP_Y = SMOKE_ROWS * CELL + 15;
const WISP_HEIGHT = 38;
const FPS = 15; // Stepped, like the dither — and cheap.
const STILL_TIME = 0.8; // The frame held when reduced motion is on.

// One ribbon of smoke at height fraction p: drifts back over the lamp as it rises and sways wider.
function strand(x: number, p: number, t: number, phase: number, drift: number, sway: number, width: number, spread: number, waves: number) {
  const centre = TIP_X - 1 - drift * p + (0.5 + sway * p) * Math.sin(p * waves - t * 1.4 + phase);
  const offset = (x - centre) / (width + spread * p);
  return Math.max(0, 1 - offset * offset);
}

function smokeDensity(x: number, y: number, t: number) {
  const height = TIP_Y - y;
  if (height < -1 || height > WISP_HEIGHT) return 0;
  const p = Math.max(0, height) / WISP_HEIGHT;
  const body = Math.max(strand(x, p, t, 0, 38, 7, 3, 7, 6.5), 0.8 * strand(x, p, t, 2.1, 26, 5, 1.8, 4.5, 8));
  const fade = Math.pow(1 - p, 1.1) * Math.min(1, (height + 3) / 4);
  const swirl = 0.75 + 0.25 * Math.sin(y * 0.5 + t * 2.2 + x * 0.12);
  return 1.7 * body * fade * swirl;
}

function smokePath(t: number) {
  const rows = Math.min(ROWS, Math.ceil((TIP_Y + 1) / CELL) + 1);
  return inkPath(COLS, rows, (row, col) => {
    // The lamp stands in front of the smoke.
    if (row >= SMOKE_ROWS && LAMP_HITS[row - SMOKE_ROWS][col]) return false;
    return smokeDensity(col * CELL + 1, row * CELL + 1, t) > bayerThreshold(row, col);
  });
}

export default function GenieLamp({ className }: GenieLampProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const smokeRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();

  useSteppedFrames(svgRef, FPS, (seconds) => smokeRef.current?.setAttribute("d", smokePath(seconds)), !reduceMotion);

  // Under reduced motion the wisp holds a single frame.
  useEffect(() => {
    if (reduceMotion) smokeRef.current?.setAttribute("d", smokePath(STILL_TIME));
  }, [reduceMotion]);

  return (
    // The box frames the lamp alone so it centres on its body; the smoke rises above it, unclipped.
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 ${SMOKE_ROWS * CELL} ${COLS * CELL} ${LAMP_ROWS * CELL}`}
      overflow="visible"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-15 w-30 text-neutral-900"}
    >
      <path ref={smokeRef} />
      <path d={LAMP_PATH} />
    </svg>
  );
}
