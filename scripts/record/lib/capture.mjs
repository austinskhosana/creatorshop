import { writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Deterministic frame-by-frame capture. Real-time screencasting drops frames
 * whenever the page is expensive to paint (the WebGL mesh gradient renders in
 * software headless), so instead time is frozen and advanced one frame at a
 * time, with a lossless-ish screenshot taken between steps:
 *
 * - JS time (rAF, performance.now, timers, Date) runs on Playwright's fake
 *   clock, which drives Framer Motion and the shaders.
 * - CSS and Web Animations run on the real document timeline, so every
 *   animation is paused on sight and stepped by hand (see stepAnimationsScript).
 *
 * Output is a constant-rate image sequence, however slowly it renders.
 */

/** Init script defining window.__recStep(dtMs), which advances every WAAPI/CSS animation. */
export function stepAnimationsScript() {
  return `(() => {
    const track = (a) => {
      a.__rec = true;
      a.pause();
      a.currentTime = 0;
    };

    // Framer Motion syncs each WAAPI animation's startTime to its own clock,
    // which is now the fake one, so the real timeline would see it as long
    // finished. Claim animations at creation and ignore later startTime/play
    // calls; the frame clock alone moves them.
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const a = animate.apply(this, args);
      track(a);
      return a;
    };
    const startTime = Object.getOwnPropertyDescriptor(Animation.prototype, "startTime");
    Object.defineProperty(Animation.prototype, "startTime", {
      configurable: true,
      get() { return startTime.get.call(this); },
      set(v) { if (!this.__rec) startTime.set.call(this, v); },
    });
    const play = Animation.prototype.play;
    Animation.prototype.play = function () {
      if (!this.__rec) return play.call(this);
    };

    window.__recStep = (dt) => {
      for (const a of document.getAnimations()) {
        try {
          // CSS transitions/animations bypass animate(); claim them on sight.
          if (!a.__rec) track(a);
          if (a.playState === "finished") continue;
          const end = a.effect ? a.effect.getComputedTiming().endTime : Infinity;
          const next = (a.currentTime || 0) + dt;
          // finish() fires the finished event so Framer Motion can commit.
          if (Number.isFinite(end) && next >= end) a.finish();
          else a.currentTime = next;
        } catch {}
      }
    };
  })();`;
}

export async function createFrameClock(page, framesDir, { fps = 60, quality = 95 } = {}) {
  const session = await page.context().newCDPSession(page);
  let frame = 0;
  let elapsed = 0;

  async function tick() {
    // Whole-millisecond steps that average out to exactly 1000/fps.
    const target = Math.round(((frame + 1) * 1000) / fps);
    const dt = target - elapsed;
    elapsed = target;
    await page.clock.runFor(dt);
    await page.evaluate((d) => window.__recStep?.(d), dt);
    const { data } = await session.send("Page.captureScreenshot", {
      format: "jpeg",
      quality,
      optimizeForSpeed: true,
    });
    await writeFile(path.join(framesDir, `${String(frame).padStart(5, "0")}.jpg`), Buffer.from(data, "base64"));
    frame++;
  }

  async function wait(ms) {
    const n = Math.round((ms * fps) / 1000);
    for (let i = 0; i < n; i++) await tick();
  }

  return {
    fps,
    tick,
    wait,
    get frames() {
      return frame;
    },
    async dispose() {
      await session.detach().catch(() => {});
    },
  };
}
