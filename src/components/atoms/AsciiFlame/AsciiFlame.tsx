"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { blackShade, rampChar } from "@/lib/asciiShading";

interface AsciiFlameProps {
  /** Background the flame burns against. Defaults to the brand green. */
  background?: string;
  className?: string;
}

const MAX_INTENSITY = 34;
// Finer grain than the background Fire atom — this is a small decorative
// icon read up close, not a full-bleed texture.
const CHAR_WIDTH = 4;
const CHAR_HEIGHT = 6;

// Coordinate space the flame silhouette is authored in.
const ART_WIDTH = 100;
const ART_HEIGHT = 150;

// Smooth closed curve through a sequence of points (Catmull-Rom → cubic
// Bezier). Lets the flame silhouette be authored as plain coordinates —
// tips and notches — instead of composed primitives.
function smoothClosedPath(points: [number, number][]): Path2D {
  const p = new Path2D();
  const n = points.length;
  p.moveTo(points[0][0], points[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    p.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
  }
  p.closePath();
  return p;
}

// A single flame silhouette — tall main tip in the center, a shorter
// lick on each side, separated by inward notches, flowing out to a
// wide belly and tapering to a point at the bottom. Walked clockwise
// from the main tip.
function buildFlamePath(wobble: number): Path2D {
  return smoothClosedPath([
    [55 + wobble * 2, 4], // main tip
    [50, 26], // notch, held at centerline...
    [50, 42], // ...across a span, not just a single point
    [93 + wobble * 1.2, 48], // right lick tip — taller, sharper
    [55, 64], // notch again, held...
    [55, 80], // ...across a span
    [90, 110], // belly, widest right
    [48, 149], // bottom point, slightly off-center
    [10, 106], // belly, widest left
    [44, 84], // notch, held...
    [44, 70], // ...across a span
    [6 - wobble * 1.2, 58], // left lick tip — shorter, rounder
    [50, 44], // notch again, held...
    [50, 28], // ...across a span
  ]);
}

export default function AsciiFlame({ background = "#a2ff38", className }: AsciiFlameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundRef = useRef(background);

  useEffect(() => {
    backgroundRef.current = background;
  }, [background]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const mask = document.createElement("canvas");
    const maskCtx = mask.getContext("2d", { willReadFrequently: true });
    if (!maskCtx) return;

    let cols = 0;
    let rows = 0;
    let raf = 0;
    const start = performance.now();

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const width = parent!.clientWidth;
      const height = parent!.clientHeight;
      cols = Math.max(10, Math.floor(width / CHAR_WIDTH));
      rows = Math.max(10, Math.floor(height / CHAR_HEIGHT));
      const cssWidth = cols * CHAR_WIDTH;
      const cssHeight = rows * CHAR_HEIGHT;
      canvas!.width = cssWidth * dpr;
      canvas!.height = cssHeight * dpr;
      canvas!.style.width = `${cssWidth}px`;
      canvas!.style.height = `${cssHeight}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      mask.width = cols;
      mask.height = rows;
    }

    function frame(time: number) {
      const t = (time - start) / 1000;
      const wobble = Math.sin(t * 1.1) * 0.6 + Math.sin(t * 2.3) * 0.3;
      const breathe = 1 + Math.sin(t * 1.7) * 0.03;

      maskCtx!.clearRect(0, 0, cols, rows);
      maskCtx!.save();
      maskCtx!.scale(cols / ART_WIDTH, (rows / ART_HEIGHT) * breathe);
      maskCtx!.fillStyle = "#000";
      maskCtx!.fill(buildFlamePath(wobble));
      maskCtx!.restore();
      const coverage = maskCtx!.getImageData(0, 0, cols, rows).data;

      ctx!.fillStyle = backgroundRef.current;
      ctx!.fillRect(0, 0, cols * CHAR_WIDTH, rows * CHAR_HEIGHT);
      ctx!.font = `${CHAR_HEIGHT}px 'Space Mono', monospace`;
      ctx!.textBaseline = "top";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const alpha = coverage[(y * cols + x) * 4 + 3];
          if (alpha < 20) continue;
          const flicker = Math.sin(t * 6 + x * 0.7 + y * 0.5) * 6;
          const intensity = Math.max(0, Math.min(MAX_INTENSITY, (alpha / 255) * MAX_INTENSITY + flicker));
          const ch = rampChar(intensity, MAX_INTENSITY);
          if (ch === " ") continue;
          ctx!.fillStyle = blackShade(intensity, MAX_INTENSITY);
          ctx!.fillText(ch, x * CHAR_WIDTH, y * CHAR_HEIGHT);
        }
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={cn("overflow-hidden", className)} style={{ background }}>
      <canvas ref={canvasRef} style={{ imageRendering: "pixelated" }} />
    </div>
  );
}
