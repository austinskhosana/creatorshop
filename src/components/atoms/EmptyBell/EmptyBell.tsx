"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedSequence } from "@/hooks/use-stepped-sequence";
import {
  type FaceSurface,
  type Part,
  type Surface,
  DITHER_CELL as CELL,
  bayerThreshold,
  brightness,
  ellipseFalloff,
  face,
  inkPath,
  isOutline,
  oblique,
  sampleGrid,
} from "@/lib/dither-art";

interface EmptyBellProps {
  className?: string;
}

// A service bell on an empty counter, in the stub-art style (see lib/dither-art): nobody's waiting,
// and the bell waits for the next one. A chrome dome — bright crown, dark horizon band, the pale
// counter reflected along its rim — on a dark base, with a plunger on top, standing on a light
// counter ledge drawn in the cart's oblique view. It's still until a mouse comes over
// it — or a finger taps it — and then it dings: the plunger goes down and rings of sound ripple out
// to either side and fade.

const COLS = 60;
const ROWS = 44;

type Kind = "counter-top" | "counter-front" | "counter-side" | "dome" | "base" | "knob" | "stem";
type BellSurface = Surface & Partial<Omit<FaceSurface<Kind>, keyof Surface>> & { kind: Kind };

// ── Counter ──────────────────────────────────────────────────────────────────

const project = oblique([8, 72]);
const COUNTER_W = 92;
const COUNTER_D = 28;
const COUNTER_H = 6;

const COUNTER: Part<BellSurface>[] = [
  face(project, [0, 0, 0], [COUNTER_W, 0, 0], [0, 0, COUNTER_H], [0, 0, 1], "counter-front", 0.5),
  face(project, [COUNTER_W, 0, 0], [0, COUNTER_D, 0], [0, 0, COUNTER_H], [1, 0, 0.3], "counter-side", 0.5),
  face(project, [0, 0, COUNTER_H], [COUNTER_W, 0, 0], [0, COUNTER_D, 0], [0, -1, 0.4], "counter-top"),
];

// ── Bell ─────────────────────────────────────────────────────────────────────

// Where the bell stands on the counter, in px: the middle of its base's foot.
const [BELL_X, BELL_FOOT] = project([COUNTER_W / 2 - 4, COUNTER_D / 2, COUNTER_H]);

function ellipsoid(cx: number, cy: number, rx: number, ry: number, rz: number, kind: Kind, maxY = Infinity): Part<BellSurface> {
  return (x, y) => {
    if (y > maxY) return null;
    const u = (x - cx) / rx;
    const v = (y - cy) / ry;
    const s = 1 - u * u - v * v;
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    return { z: 20 + w * rz, n: [u / rx, v / ry, w / rz], kind };
  };
}

const DOME_R = 18;
const DOME_Y = BELL_FOOT - 5; // The dome's widest point sits on top of the base.
const KNOB_R = 3.4;
const STEM = 4; // px of plunger stem between the dome and the knob.

// The bell, with its plunger pressed `press` px down into the dome.
function bell(press: number): Part<BellSurface>[] {
  const knobY = DOME_Y - DOME_R - STEM - KNOB_R + press;
  return [
    ellipsoid(BELL_X, BELL_FOOT - 2.5, DOME_R + 5, 5, 4, "base"),
    ellipsoid(BELL_X, DOME_Y, DOME_R, DOME_R, DOME_R, "dome", DOME_Y),
    (x, y) => (Math.abs(x - BELL_X) < 1 && y > knobY && y < DOME_Y - DOME_R + 1 ? { z: 20, n: [0, 0, 1], kind: "stem" } : null),
    ellipsoid(BELL_X, knobY, KNOB_R, KNOB_R, KNOB_R, "knob"),
  ];
}

// ── Drawing ──────────────────────────────────────────────────────────────────

// Shadow (0–1) on the counter round the bell's foot: a tight pool set a little right, because the
// light comes from the upper left.
function counterShade(x: number, y: number) {
  return Math.min(1, 1.3 * ellipseFalloff(x, y, BELL_X + 5, BELL_FOOT + 1, DOME_R + 10, 4));
}

function bellPath(press: number) {
  const hits = sampleGrid<BellSurface>([...COUNTER, ...bell(press)], COLS, ROWS);
  return inkPath(COLS, ROWS, (row, col) => {
    const hit = hits[row][col];
    if (!hit) return false;
    const threshold = bayerThreshold(row, col);
    switch (hit.kind) {
      case "counter-top":
        return !!hit.edge || 1 - counterShade(col * CELL + 1, row * CELL + 1) < threshold;
      case "counter-front":
        // A light counter: just its edges.
        return !!hit.edge;
      case "counter-side":
        return !!hit.edge || 0.32 < threshold;
      case "stem":
        return true;
      case "dome": {
        if (isOutline(hits, row, col)) return true;
        // Chrome reflects the room: bright sky over the top, a dark horizon band across the lower
        // half, and the pale counter in a strip along the bottom.
        const height = (DOME_Y - (row * CELL + 1)) / DOME_R; // 1 at the crown, 0 at the rim.
        if (height < 0.14) return 0.75 < threshold;
        if (height < 0.42) return 0.2 < threshold;
        return brightness(hit.n) * 1.15 < threshold;
      }
      case "knob":
        return isOutline(hits, row, col) || brightness(hit.n) * 0.45 < threshold;
      default:
        // The base is solid black plastic; dithered, it would only read as noise.
        return true;
    }
  });
}

// ── Ding ─────────────────────────────────────────────────────────────────────

// Rings of sound ripple out from the dome to either side: each a one-cell arc that grows a few px a
// step and thins out as it goes.
const RING_X = BELL_X;
const RING_Y = DOME_Y - DOME_R / 2;
const SPREAD = 0.55; // How far above and below level an arc reaches (as dy per dx).

function ringsPath(rings: { radius: number; strength: number }[]) {
  return inkPath(COLS, ROWS, (row, col) => {
    const dx = col * CELL + 1 - RING_X;
    const dy = row * CELL + 1 - RING_Y;
    if (Math.abs(dy) > SPREAD * Math.abs(dx)) return false;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return rings.some(({ radius, strength }) => Math.abs(distance - radius) < 1.2 && strength > bayerThreshold(row, col));
  });
}

// A ding: the plunger goes down, then a ring leaves the dome and a fainter second follows it out,
// as the bell rings on. Each step is [plunger press in px, the rings showing].
const RING_START = DOME_R + 4;
const RING_STEP = 5;
const FADE = [1, 0.8, 0.5, 0.22];

function ring(age: number, loudness: number) {
  return age >= 0 && age < FADE.length ? [{ radius: RING_START + age * RING_STEP, strength: FADE[age] * loudness }] : [];
}

const DING: [number, { radius: number; strength: number }[]][] = Array.from({ length: 8 }, (_, step) => [
  step === 0 ? 2 : 0,
  [...ring(step - 1, 1), ...ring(step - 3, 0.7)],
]);
const STEP_FPS = 12;

const RESTING = bellPath(0);
const PRESSED = bellPath(2);
const FRAMES = DING.map(([press, rings]) => ({ bell: press ? PRESSED : RESTING, rings: ringsPath(rings) }));

export default function EmptyBell({ className }: EmptyBellProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const bellRef = useRef<SVGPathElement>(null);
  const ringsRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();

  const ding = useSteppedSequence(
    svgRef,
    STEP_FPS,
    FRAMES.length,
    (step) => {
      bellRef.current?.setAttribute("d", FRAMES[step].bell);
      ringsRef.current?.setAttribute("d", FRAMES[step].rings);
    },
    !reduceMotion,
    false,
  );

  // If reduced motion turns on mid-ding, the bell falls quiet at once.
  useEffect(() => {
    if (!reduceMotion) return;
    bellRef.current?.setAttribute("d", RESTING);
    ringsRef.current?.setAttribute("d", "");
  }, [reduceMotion]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      // A mouse over the bell rings it, as does a tap on a touch screen.
      onPointerEnter={(event) => event.pointerType === "mouse" && ding()}
      onPointerDown={(event) => event.pointerType !== "mouse" && ding()}
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-22 w-30 text-neutral-900"}
    >
      <path ref={bellRef} d={RESTING} />
      <path ref={ringsRef} />
    </svg>
  );
}
