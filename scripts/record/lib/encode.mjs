import { spawn } from "node:child_process";
import path from "node:path";

// Portfolio frame: flat grey with the UI inset, no radius or shadow.
// Padding ratio measured from the portfolio card (56px border on 1112px UI).
export const FRAME = { color: "F6F6F6", padRatio: 56 / 1112 };

// X's recommended upload ceiling for landscape video.
const MAX_W = 1920;
const MAX_H = 1200;

const even = (n) => Math.round(n / 2) * 2;

/** Canvas size for a UI of innerW×innerH, scaled down to fit X's limits. */
export function frameLayout(innerW, innerH, { maxW = MAX_W, maxH = MAX_H } = {}) {
  const pad = innerW * FRAME.padRatio;
  const canvasW = innerW + pad * 2;
  const canvasH = innerH + pad * 2;
  const k = Math.min(1, maxW / canvasW, maxH / canvasH);
  return {
    canvasW: even(canvasW * k),
    canvasH: even(canvasH * k),
    innerW: even(innerW * k),
    innerH: even(innerH * k),
    pad: Math.round(pad * k),
  };
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", ["-y", "-v", "error", ...args], { stdio: ["ignore", "inherit", "inherit"] });
    proc.on("error", reject);
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });
}

const BT709 = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709"];
const H264 = ["-c:v", "libx264", "-preset", "slow", "-crf", "14", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", ...BT709];

export async function encodeShot({ framesDir, viewport, outBase, fps = 60, gif = false }) {
  const layout = frameLayout(viewport.width, viewport.height);
  const input = ["-framerate", String(fps), "-i", path.join(framesDir, "%05d.jpg")];
  // JPEG frames are full-range; X expects limited-range BT.709 or greys shift.
  const scaleTo = (w, h) => `scale=${w}:${h}:flags=area:out_color_matrix=bt709:out_range=tv,format=yuv420p`;

  const outputs = [];

  // Framed: UI centred on the portfolio grey.
  const framed = `${outBase}.mp4`;
  await ffmpeg([
    ...input,
    "-vf",
    `${scaleTo(layout.innerW, layout.innerH)},pad=${layout.canvasW}:${layout.canvasH}:${layout.pad}:${layout.pad}:color=0x${FRAME.color}`,
    ...H264,
    framed,
  ]);
  outputs.push(framed);

  // Raw: the UI alone, for edits or other layouts.
  const rawW = even(Math.min(viewport.width, MAX_W));
  const rawH = even((viewport.height * rawW) / viewport.width);
  const raw = `${outBase}-raw.mp4`;
  await ffmpeg([...input, "-vf", `${scaleTo(rawW, rawH)}`, ...H264, raw]);
  outputs.push(raw);

  if (gif) {
    // Pixel art: nearest-neighbour scaling and no dithering keep edges hard.
    const out = `${outBase}.gif`;
    const w = typeof gif === "object" && gif.width ? gif.width : 800;
    await ffmpeg([
      ...input,
      "-vf",
      `fps=30,scale=${w}:-1:flags=neighbor,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=none`,
      "-loop",
      "0",
      out,
    ]);
    outputs.push(out);
  }

  return { outputs, layout };
}

/** Frames a lossless 2× screenshot as a PNG at full resolution (no X size cap). */
export async function frameStill({ screenshot, viewport, scale, out }) {
  const layout = frameLayout(viewport.width * scale, viewport.height * scale, { maxW: Infinity, maxH: Infinity });
  await ffmpeg([
    "-i",
    screenshot,
    "-vf",
    `pad=${layout.canvasW}:${layout.canvasH}:${layout.pad}:${layout.pad}:color=0x${FRAME.color}`,
    out,
  ]);
  return out;
}
