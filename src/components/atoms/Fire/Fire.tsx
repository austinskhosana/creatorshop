"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";
import { blackShade, rampChar } from "@/lib/asciiShading";

interface FireProps {
  /** Background the flame burns against. Defaults to the brand green. */
  background?: string;
  /** How much of the floor is on fire, 0-100. */
  widthPercent?: number;
  /** Whether the simulation is animating. */
  playing?: boolean;
  /** Rows the flame gets to climb before it's forced to dissipate — taller = flame can reach higher. */
  rows?: number;
  className?: string;
}

export interface FireHandle {
  /** Current animation frame as a PNG. */
  exportPNG: () => void;
  /** Current animation frame as a vector SVG (real <text> glyphs, not a raster trace). */
  exportSVG: () => void;
  /** Current animation frame as plain monospace text. */
  exportTXT: () => void;
  /** Records the live canvas to a WebM clip. Resolves once the file has downloaded. */
  exportWebM: (durationMs?: number) => Promise<void>;
}

const MAX_INTENSITY = 34;
const CHAR_WIDTH = 6;
const CHAR_HEIGHT = 10;

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const Fire = forwardRef<FireHandle, FireProps>(function Fire(
  { background = "#a2ff38", widthPercent = 40, playing = true, rows: rowCount = 56, className },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const widthPercentRef = useRef(widthPercent);
  const playingRef = useRef(playing);
  const rowCountRef = useRef(rowCount);
  const backgroundRef = useRef(background);
  const fireDataRef = useRef<Uint8Array | null>(null);
  const dimsRef = useRef({ cols: 0, rows: 0 });

  useEffect(() => {
    backgroundRef.current = background;
  }, [background]);

  useEffect(() => {
    widthPercentRef.current = widthPercent;
  }, [widthPercent]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    rowCountRef.current = rowCount;
  }, [rowCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    let cols = 0;
    let rows = 0;
    let fire: Uint8Array | null = null;
    let raf = 0;

    function seedSource() {
      if (!fire) return;
      const litCols = Math.max(4, Math.floor(cols * (widthPercentRef.current / 100)));
      const margin = Math.floor((cols - litCols) / 2);
      const taperZone = Math.max(2, Math.floor(litCols * 0.18));
      for (let x = 0; x < cols; x++) fire[(rows - 1) * cols + x] = 0;
      for (let i = 0; i < litCols; i++) {
        const x = margin + i;
        const edgeDist = Math.min(i, litCols - 1 - i);
        const taper = Math.min(1, edgeDist / taperZone);
        fire[(rows - 1) * cols + x] = Math.round(MAX_INTENSITY * (0.55 + 0.45 * taper));
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const width = parent!.clientWidth;
      cols = Math.max(12, Math.floor(width / CHAR_WIDTH));
      rows = Math.max(12, rowCountRef.current);
      const cssWidth = cols * CHAR_WIDTH;
      const cssHeight = rows * CHAR_HEIGHT;
      canvas!.width = cssWidth * dpr;
      canvas!.height = cssHeight * dpr;
      canvas!.style.width = `${cssWidth}px`;
      canvas!.style.height = `${cssHeight}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      fire = new Uint8Array(cols * rows);
      fireDataRef.current = fire;
      dimsRef.current = { cols, rows };
      seedSource();
    }

    function step() {
      if (!fire) return;
      for (let x = 0; x < cols; x++) {
        for (let y = 1; y < rows; y++) {
          const src = y * cols + x;
          const pixel = fire[src];
          if (pixel === 0) {
            fire[src - cols] = 0;
          } else {
            const decayRand = Math.floor(Math.random() * 3); // 0,1,2
            const drift = Math.floor(Math.random() * 3) - 1; // -1,0,1
            let dstX = x + drift;
            if (dstX < 0) dstX = 0;
            if (dstX >= cols) dstX = cols - 1;
            const dst = (y - 1) * cols + dstX;
            fire[dst] = Math.max(0, pixel - decayRand);
          }
        }
      }
      seedSource();
    }

    function draw() {
      if (!fire) return;
      ctx!.fillStyle = backgroundRef.current;
      ctx!.fillRect(0, 0, cols * CHAR_WIDTH, rows * CHAR_HEIGHT);
      // Canvas can't resolve CSS custom properties in `font` — spell out the actual stack.
      ctx!.font = `${CHAR_HEIGHT - 2}px 'Space Mono', monospace`;
      ctx!.textBaseline = "top";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = fire[y * cols + x];
          if (v === 0) continue;
          const ch = rampChar(v, MAX_INTENSITY);
          if (ch === " ") continue;
          ctx!.fillStyle = blackShade(v, MAX_INTENSITY);
          ctx!.fillText(ch, x * CHAR_WIDTH, y * CHAR_HEIGHT);
        }
      }
    }

    function frame() {
      if (playingRef.current) {
        step();
        draw();
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

  useImperativeHandle(
    ref,
    () => ({
      exportPNG: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
          if (blob) triggerDownload(`fire-${Date.now()}.png`, blob);
        }, "image/png");
      },

      exportSVG: () => {
        const fire = fireDataRef.current;
        const { cols, rows } = dimsRef.current;
        if (!fire) return;
        const width = cols * CHAR_WIDTH;
        const height = rows * CHAR_HEIGHT;
        let glyphs = "";
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const v = fire[y * cols + x];
            if (v === 0) continue;
            const ch = rampChar(v, MAX_INTENSITY);
            if (ch === " ") continue;
            const escaped = ch.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            glyphs += `<text x="${x * CHAR_WIDTH}" y="${y * CHAR_HEIGHT + CHAR_HEIGHT - 3}" fill="${blackShade(v, MAX_INTENSITY)}">${escaped}</text>`;
          }
        }
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${background}"/><g font-family="monospace" font-size="${CHAR_HEIGHT - 2}">${glyphs}</g></svg>`;
        triggerDownload(`fire-${Date.now()}.svg`, new Blob([svg], { type: "image/svg+xml" }));
      },

      exportTXT: () => {
        const fire = fireDataRef.current;
        const { cols, rows } = dimsRef.current;
        if (!fire) return;
        const lines: string[] = [];
        for (let y = 0; y < rows; y++) {
          let line = "";
          for (let x = 0; x < cols; x++) {
            line += rampChar(fire[y * cols + x], MAX_INTENSITY);
          }
          lines.push(line.replace(/\s+$/, ""));
        }
        triggerDownload(`fire-${Date.now()}.txt`, new Blob([lines.join("\n")], { type: "text/plain" }));
      },

      exportWebM: (durationMs = 4000) => {
        return new Promise<void>((resolve) => {
          const canvas = canvasRef.current;
          if (!canvas || typeof canvas.captureStream !== "function") {
            resolve();
            return;
          }
          const stream = canvas.captureStream(30);
          const mimeType = ["video/webm;codecs=vp9", "video/webm"].find((type) =>
            typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type),
          );
          if (!mimeType) {
            resolve();
            return;
          }
          const recorder = new MediaRecorder(stream, { mimeType });
          const chunks: BlobPart[] = [];
          recorder.ondataavailable = (e) => {
            if (e.data.size) chunks.push(e.data);
          };
          recorder.onstop = () => {
            triggerDownload(`fire-${Date.now()}.webm`, new Blob(chunks, { type: "video/webm" }));
            resolve();
          };
          recorder.start();
          setTimeout(() => recorder.stop(), durationMs);
        });
      },
    }),
    [background],
  );

  return (
    <div className={cn("overflow-hidden", className)} style={{ background }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-x-0 bottom-0"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
});

export default Fire;
