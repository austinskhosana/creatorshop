"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";
import { type Part, type Surface, type Vec, bayerThreshold, brightness, ellipseFalloff, inkPath, isOutline, sampleGrid } from "@/lib/dither-art";

interface EmptyCartProps {
  className?: string;
}

// An empty shopping cart in the stub-art style (see lib/dither-art) — the same lit, dithered,
// outlined drawing as GenieLamp and MoneyStack, seen from the same 45° angle as the money. The basket
// is wire: the near side's wires are solid, the far side's dotted, and the hollow inside is a faint
// shadow seen through them, so the cart reads as empty. Rims, handle, frame and wheels are shaded
// tubes, and it stands on the same fading floor shadow. It's always on the move: the shop floor's
// tiles slide back beneath it, the wheels turn to match, speed lines stream off behind, and it
// bumps a pixel over each tile seam — an endless loop that keeps the cart centred.

const COLS = 60;
const ROWS = 45;

// World → screen. x runs along the cart, d into the page, h up; depth shears up and right like the
// money bundles.
const ORIGIN = [22, 74];
function project(x: number, d: number, h: number): [number, number] {
  return [ORIGIN[0] + x + 0.5 * d, ORIGIN[1] - h - 0.5 * d];
}

// The basket: the back end is upright at x = 0; the front end slants out from x = 56 at the bottom
// (h = 22) to x = 70 at the rim (h = 52). It is 26 deep.
const DEPTH = 26;
const BOTTOM = 22;
const RIM = 52;
const FRONT_LOW = 56;
const FRONT_HIGH = 70;
const SLANT = (FRONT_HIGH - FRONT_LOW) / (RIM - BOTTOM);
const frontAt = (h: number) => FRONT_LOW + SLANT * (h - BOTTOM);

type Kind = "metal" | "wheel" | "near-wire" | "far-wire" | "inside";
type CartSurface = Surface & { kind: Kind; shadow?: number; u?: number; v?: number };

// True within half a wire's width of a grid line every `step` units.
function onWire(value: number, step: number) {
  return ((value % step) + step) % step < 1.1;
}

// How deep in the basket's shadow a point on its inside is: darker toward the bottom and the back.
function insideShadow(h: number, x: number) {
  return 0.26 * (1 - (h - BOTTOM) / (RIM - BOTTOM)) + 0.1 * (1 - x / FRONT_HIGH);
}

// A side of the basket at depth d. The near side is only its wires; the far side is wires over the
// shadowed inside.
function side(d: number, near: boolean): Part<CartSurface> {
  return (sx, sy) => {
    const x = sx - ORIGIN[0] - 0.5 * d;
    const h = ORIGIN[1] - sy - 0.5 * d;
    if (h < BOTTOM || h > RIM || x < 0 || x > frontAt(h)) return null;
    const wire = onWire(x - 1, 9.5) || onWire(h - BOTTOM, 7.5);
    if (near && !wire) return null;
    return { z: -d + 1, n: [0, 0, 1], kind: wire ? (near ? "near-wire" : "far-wire") : "inside", shadow: insideShadow(h, x) };
  };
}

// The inside of the back end (x = 0), seen through the open top.
const backEnd: Part<CartSurface> = (sx, sy) => {
  const d = 2 * (sx - ORIGIN[0]);
  const h = ORIGIN[1] - sy - 0.5 * d;
  if (d < 0 || d > DEPTH || h < BOTTOM || h > RIM) return null;
  const wire = onWire(d, 8.7) || onWire(h - BOTTOM, 7.5);
  return { z: -d, n: [1, 0, 0.3], kind: wire ? "far-wire" : "inside", shadow: insideShadow(h, 0) + 0.06 };
};

// The slanted front end, x = frontAt(h).
const frontEnd: Part<CartSurface> = (sx, sy) => {
  const h = (sx - ORIGIN[0] - FRONT_LOW + SLANT * BOTTOM - (ORIGIN[1] - sy)) / (SLANT - 1);
  const d = 2 * (ORIGIN[1] - h - sy);
  if (d < 0 || d > DEPTH || h < BOTTOM || h > RIM) return null;
  if (!(onWire(d, 8.7) || onWire(h - BOTTOM, 7.5))) return null;
  return { z: -d + 1, n: [0.8, 0.2, 0.55], kind: "near-wire" };
};

// The basket's floor, seen through the near wires.
const basketFloor: Part<CartSurface> = (sx, sy) => {
  const d = 2 * (ORIGIN[1] - BOTTOM - sy);
  const x = sx - ORIGIN[0] - 0.5 * d;
  if (d < 0 || d > DEPTH || x < 0 || x > FRONT_LOW) return null;
  return { z: -d - 0.5, n: [0, -0.9, 0.43], kind: "inside", shadow: 0.26 + 0.1 * (1 - x / FRONT_HIGH) };
};

// A round bar between two world points, shaded across its width. Bars sit just in front of the
// wires at the same depth.
function bar(a: Vec, b: Vec, r: number): Part<CartSurface> {
  const [ax, ay] = project(...a);
  const [bx, by] = project(...b);
  const dx = bx - ax;
  const dy = by - ay;
  const length2 = dx * dx + dy * dy;
  return (x, y) => {
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length2));
    const ex = x - (ax + dx * t);
    const ey = y - (ay + dy * t);
    const s = 1 - (ex * ex + ey * ey) / (r * r);
    if (s <= 0) return null;
    const w = Math.sqrt(s);
    return { z: -(a[1] + (b[1] - a[1]) * t) + 2 + 0.2 * w * r, n: [ex / r, ey / r, w], kind: "metal" };
  };
}

const WHEEL_RADIUS = 5;
const WHEELS = [5, 55]; // Along the cart.

// A wheel on the near side, face on, with a hub.
function wheel(x: number, r: number): Part<CartSurface> {
  const [cx, cy] = project(x, 0, r);
  return (px, py) => {
    const u = (px - cx) / r;
    const v = (py - cy) / r;
    const s = 1 - u * u - v * v;
    if (s <= 0) return null;
    return { z: 3 + Math.sqrt(s), n: [0.5 * u, 0.5 * v, 1], kind: "wheel", u, v };
  };
}

const CART: Part<CartSurface>[] = [
  basketFloor,
  side(DEPTH, false),
  backEnd,
  side(0, true),
  frontEnd,
  // Rims round the top and along the near bottom.
  bar([0, 0, RIM], [FRONT_HIGH, 0, RIM], 1.3),
  bar([0, DEPTH, RIM], [FRONT_HIGH, DEPTH, RIM], 1.3),
  bar([0, 0, RIM], [0, DEPTH, RIM], 1.3),
  bar([FRONT_HIGH, 0, RIM], [FRONT_HIGH, DEPTH, RIM], 1.3),
  bar([0, 0, BOTTOM], [FRONT_LOW, 0, BOTTOM], 1.3),
  bar([FRONT_LOW, 0, BOTTOM], [FRONT_HIGH, 0, RIM], 1.3),
  bar([FRONT_LOW, 0, BOTTOM], [FRONT_LOW, DEPTH, BOTTOM], 1.3),
  bar([0, 0, BOTTOM], [0, 0, RIM], 1.3),
  bar([FRONT_LOW, DEPTH, BOTTOM], [FRONT_HIGH, DEPTH, RIM], 1.17),
  bar([0, DEPTH, BOTTOM], [FRONT_LOW, DEPTH, BOTTOM], 1.17),
  // Handle.
  bar([0, 0, RIM], [-10, 0, 57], 1.2),
  bar([0, DEPTH, RIM], [-10, DEPTH, 57], 1.1),
  bar([-10, 0, 57], [-10, DEPTH, 57], 1.9),
  // Frame and wheels.
  bar([0, 0, BOTTOM], [5, 0, 9], 1.1),
  bar([FRONT_LOW, 0, BOTTOM], [55, 0, 9], 1.1),
  bar([5, 0, 9], [55, 0, 9], 1.1),
  ...WHEELS.map((x) => wheel(x, WHEEL_RADIUS)),
];

// ── Floor ────────────────────────────────────────────────────────────────────

// Shadow (0–1) on the floor: a soft pool under the cart with contact shadows at the wheels. Only the
// near side shows, so no dots appear behind the frame.
function floorShade(x: number, y: number) {
  const [cx, cy] = project(30, DEPTH / 2, 0);
  let shade = 0.4 * ellipseFalloff(x, y, cx + 4, cy + 4, 58, 12);
  for (const wheelX of WHEELS) {
    const [wx, wy] = project(wheelX, 0, 0);
    shade += 0.35 * ellipseFalloff(x, y, wx + 1, wy, 8, 2.5);
  }
  return shade * Math.min(1, Math.max(0, (y - 66) / 5));
}

// The shop floor: tile seams running into the page every TILE px of floor, offset by how far the
// cart has travelled so they slide back beneath it. Each seam is one cell per row, solid near the
// cart and dotted on alternate rows as it fades — a pattern that holds steady as the seams move,
// where the Bayer matrix would thin some diagonals and make them flicker.
const TILE = 24;

function onTileSeam(x: number, y: number, row: number, travelled: number) {
  const d = 2 * (ORIGIN[1] - y); // Back from the screen to the floor plane (h = 0).
  const along = x - ORIGIN[0] - 0.5 * d + travelled;
  if (((along % TILE) + TILE) % TILE >= 1.2) return false;
  const [cx, cy] = project(30, DEPTH / 2, 0);
  const fade = ellipseFalloff(x, y, cx, cy + 6, 74, 16) * Math.min(1, Math.max(0, (y - 58) / 6));
  return fade > 0.4 || (fade > 0.12 && row % 2 === 0);
}

// ── Cart ─────────────────────────────────────────────────────────────────────

const HITS = sampleGrid(CART, COLS, ROWS);

const CART_PATH = inkPath(COLS, ROWS, (row, col) => {
  const threshold = bayerThreshold(row, col);
  const hit = HITS[row][col];
  if (!hit) return false;
  switch (hit.kind) {
    case "near-wire":
      return true;
    case "far-wire":
      return 0.62 < threshold; // Dotted, so the far side recedes.
    case "inside":
      return 0.98 - (hit.shadow ?? 0) < threshold;
    default: {
      const hub = hit.kind === "wheel" && (hit.u ?? 0) ** 2 + (hit.v ?? 0) ** 2 < 0.09;
      return hub || isOutline(HITS, row, col) || brightness(hit.n) * (hit.kind === "wheel" ? 1.2 : 1) < threshold;
    }
  }
});

// The floor round the cart — its shadow plus the tile seams — `travelled` px into the journey.
function floorPath(travelled: number) {
  return inkPath(COLS, ROWS, (row, col) => {
    if (HITS[row][col]) return false;
    const x = col * 2 + 1;
    const y = row * 2 + 1;
    return onTileSeam(x, y, row, travelled) || 1 - floorShade(x, y) < bayerThreshold(row, col);
  });
}

// A spoke across each hub, at the angle whose cosine and sine are given, so the wheels visibly turn.
function spokesPath(cos: number, sin: number) {
  let path = "";
  for (const x of WHEELS) {
    const [cx, cy] = project(x, 0, WHEEL_RADIUS);
    for (const side of [-1, 1]) {
      const col = Math.floor((cx + side * 2.6 * cos) / 2);
      const row = Math.floor((cy + side * 2.6 * sin) / 2);
      path += `M${col * 2} ${row * 2}h2v2h-2z`;
    }
  }
  return path;
}

// Speed lines streaming back from behind the basket, faster than the floor. Each is solid where it
// leaves the cart and breaks into dashes, then dots, as it trails away.
const TRAILS = [
  { y: 30, length: 16, speed: 1.6, offset: 0 },
  { y: 40, length: 12, speed: 2.1, offset: 14 },
  { y: 49, length: 8, speed: 1.8, offset: 27 },
];
const TRAIL_FROM = 20; // px — the back of the basket.
const TRAIL_SPAN = 40; // px each line travels before it comes round again.

function trailsPath(travelled: number) {
  let path = "";
  for (const { y, length, speed, offset } of TRAILS) {
    const head = TRAIL_FROM - ((travelled * speed + offset) % TRAIL_SPAN);
    const row = Math.floor(y / 2);
    const first = Math.round(head / 2);
    for (let col = Math.max(0, first); col < Math.min(TRAIL_FROM / 2, first + length / 2); col++) {
      const strength = 1 - (TRAIL_FROM - col * 2) / TRAIL_SPAN; // 1 at the cart, 0 at the far end.
      if (strength > 0.6 || (strength > 0.35 && col % 2 === 0) || (strength > 0.15 && col % 4 === 0)) {
        path += `M${col * 2} ${row * 2}h2v2h-2z`;
      }
    }
  }
  return path;
}

// Whether a wheel is rolling over a seam, which lifts the cart a pixel.
function onSeam(travelled: number) {
  return WHEELS.some((x) => (((x + travelled) % TILE) + TILE) % TILE < 2);
}

// ── Motion ───────────────────────────────────────────────────────────────────

const ROLL_FPS = 60; // Redraws only when the floor has moved a whole pixel.
const CRUISE = 22; // px/s along the floor.
const HURRY = 56; // px/s while a mouse is over the cart.
const EASE = 0.35; // s to ease between the two.

const RESTING_FLOOR = floorPath(0);
const RESTING_SPOKES = spokesPath(1, 0);
const RESTING_TRAILS = trailsPath(0);

export default function EmptyCart({ className }: EmptyCartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const cartRef = useRef<SVGGElement>(null);
  const floorRef = useRef<SVGPathElement>(null);
  const spokesRef = useRef<SVGPathElement>(null);
  const trailsRef = useRef<SVGPathElement>(null);
  const journey = useRef({ travelled: 0, speed: CRUISE, target: CRUISE, time: 0, shown: 0 });
  const reduceMotion = useReducedMotion();

  // Draws everything `travelled` whole px along, snapped so the dither stays crisp.
  function show(travelled: number) {
    journey.current.shown = travelled;
    // Rolling without slipping: the wheels turn by distance over radius.
    const angle = travelled / WHEEL_RADIUS;
    floorRef.current?.setAttribute("d", floorPath(travelled));
    spokesRef.current?.setAttribute("d", spokesPath(Math.cos(angle), Math.sin(angle)));
    trailsRef.current?.setAttribute("d", trailsPath(travelled));
    cartRef.current?.setAttribute("transform", `translate(0 ${onSeam(travelled) ? -1 : 0})`);
  }

  useSteppedFrames(
    svgRef,
    ROLL_FPS,
    (seconds) => {
      const state = journey.current;
      const dt = Math.min(seconds - state.time, 1 / 30);
      state.time = seconds;
      state.speed += (state.target - state.speed) * (1 - Math.exp(-dt / EASE));
      state.travelled += state.speed * dt;
      const travelled = Math.round(state.travelled);
      if (travelled !== state.shown) show(travelled);
    },
    !reduceMotion,
  );

  // Under reduced motion the cart holds its first frame — including if the setting changes mid-roll.
  useEffect(() => {
    if (!reduceMotion || journey.current.shown === 0) return;
    journey.current.travelled = 0;
    show(0);
  });

  // A mouse over the cart hurries it along; it eases back to a stroll when the mouse leaves.
  function hurry(target: number) {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    journey.current.target = target;
  }

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      onPointerEnter={(event) => event.pointerType === "mouse" && hurry(HURRY)}
      onPointerLeave={() => hurry(CRUISE)}
      viewBox={`0 0 ${COLS * 2} ${ROWS * 2}`}
      overflow="visible"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className ?? "h-22.5 w-30 text-neutral-900"}
    >
      <path ref={floorRef} d={RESTING_FLOOR} />
      <path ref={trailsRef} d={RESTING_TRAILS} />
      <g ref={cartRef}>
        <path d={CART_PATH} />
        <path ref={spokesRef} d={RESTING_SPOKES} />
      </g>
    </svg>
  );
}
