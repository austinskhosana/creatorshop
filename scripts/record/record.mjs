#!/usr/bin/env node
// Scripted screen recordings for social posts.
//
//   npm run record                 every shot
//   npm run record brand-hero      one or more named shots
//   npm run record -- --list       list shots
//   BASE_URL=http://localhost:3001 npm run record brand-hero
//
// Needs the dev server running. Output lands in social/recordings/<shot>/.

import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { createFrameClock, stepAnimationsScript } from "./lib/capture.mjs";
import { createCursor, cursorInitScript } from "./lib/cursor.mjs";
import { encodeShot, frameStill } from "./lib/encode.mjs";
import { SHOTS } from "./shots.mjs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const SCALE = 2;
const FPS = 60;
const OUT_DIR = path.resolve("social/recordings");

async function recordShot(browser, name, shot) {
  const dir = path.join(OUT_DIR, name);
  const framesDir = path.join(dir, ".frames");
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: SCALE,
    reducedMotion: "no-preference",
  });
  await context.addInitScript(cursorInitScript());
  await context.addInitScript(stepAnimationsScript());
  const page = await context.newPage();
  const url = new URL(shot.path, BASE_URL).toString();

  // Warm-up visit on the real clock: compiles the route in dev and caches
  // fonts and images, so the recorded load looks like production.
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.goto("about:blank");

  // Freeze time, then load: nothing moves except when the frame clock ticks.
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
  const clock = await createFrameClock(page, framesDir, { fps: FPS });
  const cursor = createCursor(page, clock, shot.cursorStart);
  await page.goto(url, { waitUntil: "load" });
  await shot.run({ page, cursor, wait: clock.wait });
  await clock.dispose();
  const frameCount = clock.frames;

  // Lossless still of the final state, cursor hidden.
  await page.evaluate(() => document.getElementById("__rec-cursor")?.remove());
  const screenshot = path.join(framesDir, "still.png");
  await page.screenshot({ path: screenshot });
  await context.close();

  const outBase = path.join(dir, name);
  const result = await encodeShot({ framesDir, viewport: shot.viewport, outBase, fps: FPS, gif: shot.gif });
  const still = await frameStill({ screenshot, viewport: shot.viewport, scale: SCALE, out: `${outBase}.png` });

  await rm(framesDir, { recursive: true, force: true });
  return { ...result, frameCount, outputs: [...result.outputs, still] };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--list")) {
    console.log(Object.keys(SHOTS).join("\n"));
    return;
  }
  const names = args.filter((a) => !a.startsWith("--"));
  const selected = names.length ? names : Object.keys(SHOTS);
  const unknown = selected.filter((n) => !SHOTS[n]);
  if (unknown.length) {
    console.error(`Unknown shot(s): ${unknown.join(", ")}\nAvailable: ${Object.keys(SHOTS).join(", ")}`);
    process.exit(1);
  }

  try {
    await fetch(BASE_URL, { method: "HEAD" });
  } catch {
    console.error(`Can't reach ${BASE_URL}. Start the dev server first (npm run dev).`);
    process.exit(1);
  }

  const browser = await chromium.launch({ args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist"] });
  try {
    for (const name of selected) {
      process.stdout.write(`● ${name} … `);
      const started = Date.now();
      const { outputs, frameCount, layout } = await recordShot(browser, name, SHOTS[name]);
      const took = ((Date.now() - started) / 1000).toFixed(0);
      console.log(`${(frameCount / FPS).toFixed(1)}s at ${FPS}fps, ${layout.canvasW}×${layout.canvasH} (rendered in ${took}s)`);
      for (const o of outputs) console.log(`    ${path.relative(process.cwd(), o)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
