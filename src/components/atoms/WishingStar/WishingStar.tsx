"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type Part, type Vec, DITHER_CELL as CELL, bayerThreshold, brightness, inkPath, isOutline, sampleGrid } from "@/lib/dither-art";

interface WishingStarProps {
  className?: string;
}

// A shooting star to wish on, in the stub-art style (see lib/dither-art) — the same lit, dithered,
// outlined drawing as GenieLamp and EmptyCart. The star is a faceted solid: ten flat faces rising
// from its points to a raised centre, each catching the upper-left light differently. It's always
// streaking down and to the right: trails stream back off it, solid where they leave the star and
// breaking into dashes, then dots, and pixel sparkles twinkle in the sky round it.

const COLS = 60;
const ROWS = 44;

// ── Star ─────────────────────────────────────────────────────────────────────

const CX = 80;
const CY = 50;
const OUTER = 30;
const INNER = 12.5;
const APEX = 11; // How far the centre rises off the page.

// Unit directions to the points of an upright star — written with sqrt only (cos 36° = (1 + √5) / 4
// and so on), so server and client build the identical path — then tilted 15° clockwise.
const ROOT5 = Math.sqrt(5);
const COS36 = (1 + ROOT5) / 4;
const SIN36 = Math.sqrt(10 - 2 * ROOT5) / 4;
const COS72 = (ROOT5 - 1) / 4;
const SIN72 = Math.sqrt(10 + 2 * ROOT5) / 4;
const TILT_COS = 0.96593;
const TILT_SIN = 0.25882;

function tilted([x, y]: [number, number], radius: number): [number, number] {
  return [CX + radius * (x * TILT_COS - y * TILT_SIN), CY + radius * (x * TILT_SIN + y * TILT_COS)];
}

const POINTS = ([[0, -1], [SIN72, -COS72], [SIN36, COS36], [-SIN36, COS36], [-SIN72, -COS72]] as [number, number][]).map((d) => tilted(d, OUTER));
const NOTCHES = ([[SIN36, -COS36], [SIN72, COS72], [0, 1], [-SIN72, COS72], [-SIN36, -COS36]] as [number, number][]).map((d) => tilted(d, INNER));

// One flat face: the triangle from the raised centre to a point and a notch on the page.
function facet(point: [number, number], notch: [number, number]): Part {
  const [px, py] = point;
  const [qx, qy] = notch;
  // Normal of the plane through (CX, CY, APEX), (px, py, 0) and (qx, qy, 0), turned to face the viewer.
  const a: Vec = [px - CX, py - CY, -APEX];
  const b: Vec = [qx - CX, qy - CY, -APEX];
  let n: Vec = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  if (n[2] < 0) n = [-n[0], -n[1], -n[2]];
  const det = (py - qy) * (CX - qx) + (qx - px) * (CY - qy);
  return (x, y) => {
    // Barycentric weights of the centre and the point; the notch has what's left.
    const centre = ((py - qy) * (x - qx) + (qx - px) * (y - qy)) / det;
    const tip = ((qy - CY) * (x - qx) + (CX - qx) * (y - qy)) / det;
    if (centre < 0 || tip < 0 || centre + tip > 1) return null;
    return { z: APEX * centre, n };
  };
}

const STAR: Part[] = POINTS.flatMap((point, k) => [facet(point, NOTCHES[k]), facet(point, NOTCHES[(k + 4) % 5])]);
const HITS = sampleGrid(STAR, COLS, ROWS);

const STAR_PATH = inkPath(COLS, ROWS, (row, col) => {
  const hit = HITS[row][col];
  return !!hit && (isOutline(HITS, row, col) || brightness(hit.n) < bayerThreshold(row, col));
});

// ── Trails ───────────────────────────────────────────────────────────────────

// The star flies down and to the right; trails run back the other way from under it, each in its
// own lane. Near the star a trail is solid; further back it breaks into dashes that stream away, and
// it thins to dots before it ends.
const HEADING: [number, number] = [0.8, 0.6];
const ACROSS: [number, number] = [-0.6, 0.8];
const TRAILS = [
  { lane: 0, length: 66, speed: 1 },
  { lane: -12, length: 44, speed: 1.3 },
  { lane: 12, length: 34, speed: 1.15 },
];
const TRAIL_FROM = 12; // px behind the centre, under the star.
const DASH = 8; // px from one dash to the next.

function nearStar(row: number, col: number) {
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) if (HITS[r]?.[c]) return true;
  }
  return false;
}

function trailsPath(travelled: number) {
  return inkPath(COLS, ROWS, (row, col) => {
    if (nearStar(row, col)) return false; // Trails stop a cell short, so the star keeps a clean edge.
    const dx = col * CELL + 1 - CX;
    const dy = row * CELL + 1 - CY;
    const behind = -(dx * HEADING[0] + dy * HEADING[1]) - TRAIL_FROM;
    const across = dx * ACROSS[0] + dy * ACROSS[1];
    return TRAILS.some(({ lane, length, speed }) => {
      if (behind < 0 || behind > length || Math.abs(across - lane) > 1.3) return false;
      const strength = 1 - behind / length; // 1 at the star, 0 at the end of the trail.
      const phase = (((behind - travelled * speed) % DASH) + DASH) % DASH;
      return strength > 0.6 || (strength > 0.3 && phase < DASH / 2) || (strength > 0.05 && phase < CELL);
    });
  });
}

// ── Sparkles ─────────────────────────────────────────────────────────────────

// Pixel sparkles round the star, clear of its trails. Each one blinks on as a dot, opens into a
// cross, and closes again, out of step with the others.
const SPARKLES = [
  { x: 14, y: 42, phase: 0 },
  { x: 58, y: 6, phase: 0.35 },
  { x: 112, y: 14, phase: 0.6 },
  { x: 40, y: 78, phase: 0.8 },
];
const TWINKLE = 2.4; // s per blink cycle.

function sparkleCells(col: number, row: number, size: number) {
  let path = `M${col * CELL} ${row * CELL}h${CELL}v${CELL}h${-CELL}z`;
  if (size > 1) {
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      path += `M${(col + dc) * CELL} ${(row + dr) * CELL}h${CELL}v${CELL}h${-CELL}z`;
    }
  }
  return path;
}

function sparklesPath(seconds: number) {
  let path = "";
  for (const { x, y, phase } of SPARKLES) {
    const t = (seconds / TWINKLE + phase) % 1;
    // Dark for most of the cycle, then a dot, a cross, and a dot again.
    const size = t < 0.62 ? 0 : t < 0.72 || t > 0.88 ? 1 : 2;
    if (size) path += sparkleCells(Math.floor(x / CELL), Math.floor(y / CELL), size);
  }
  return path;
}

// ── Motion ───────────────────────────────────────────────────────────────────

const FPS = 15; // Stepped, like the dither — and cheap.
const SPEED = 34; // px/s the trails slide back.
const STILL_TIME = 0.45; // The frame held when reduced motion is on.

const RESTING_TRAILS = trailsPath(STILL_TIME * SPEED);
const RESTING_SPARKLES = sparklesPath(STILL_TIME * TWINKLE);

export default function WishingStar({ className }: WishingStarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const trailsRef = useRef<SVGPathElement>(null);
  const sparklesRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();

  useSteppedFrames(
    svgRef,
    FPS,
    (seconds) => {
      trailsRef.current?.setAttribute("d", trailsPath(Math.round(seconds * SPEED)));
      sparklesRef.current?.setAttribute("d", sparklesPath(seconds));
    },
    !reduceMotion,
  );

  // Under reduced motion the sky holds one frame — including if the setting changes mid-flight.
  useEffect(() => {
    if (!reduceMotion) return;
    trailsRef.current?.setAttribute("d", RESTING_TRAILS);
    sparklesRef.current?.setAttribute("d", RESTING_SPARKLES);
  }, [reduceMotion]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-22 w-30 text-neutral-900"}
    >
      <path ref={trailsRef} d={RESTING_TRAILS} />
      <path ref={sparklesRef} d={RESTING_SPARKLES} />
      <path d={STAR_PATH} />
    </svg>
  );
}
