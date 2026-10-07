// Headless Chromium draws no pointer, so recordings get a DOM cursor that
// follows real mouse events. Installed as an init script so it survives
// navigations within a shot.

const CURSOR_SVG = `
<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 2.5v15.2l3.9-3.7 2.6 6 2.7-1.2-2.6-5.9h5.4L4 2.5z" fill="#111" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>
</svg>`;

export function cursorInitScript() {
  return `(() => {
    const install = () => {
      if (document.getElementById("__rec-cursor")) return;
      const style = document.createElement("style");
      // Hide the Next.js dev indicator so it never lands in a recording.
      style.textContent = "nextjs-portal{display:none!important}";
      document.head.appendChild(style);

      const el = document.createElement("div");
      el.id = "__rec-cursor";
      el.innerHTML = ${JSON.stringify(CURSOR_SVG)};
      Object.assign(el.style, {
        position: "fixed", left: "0", top: "0", zIndex: "2147483647",
        pointerEvents: "none", opacity: "0", transition: "opacity 200ms ease-out",
        transform: "translate(-4px,-2px)",
      });
      document.documentElement.appendChild(el);
      window.addEventListener("mousemove", (e) => {
        el.style.opacity = "1";
        el.style.transform = "translate(" + (e.clientX - 4) + "px," + (e.clientY - 2) + "px)";
      }, { passive: true, capture: true });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", install);
    } else {
      install();
    }
  })();`;
}

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Moves the mouse along gently curved, eased paths so it reads like a hand
 * rather than a robot. Every position lands on its own frame via clock.tick().
 */
export function createCursor(page, clock, start = { x: 0, y: 0 }) {
  let pos = { ...start };
  const framesFor = (ms) => Math.max(1, Math.round((ms * clock.fps) / 1000));

  /** `arc` bows the path sideways as a fraction of the distance travelled. */
  async function moveTo(x, y, { duration = 900, arc = 0.12 } = {}) {
    const from = pos;
    const dx = x - from.x;
    const dy = y - from.y;
    // Control point offset perpendicular to the travel direction.
    const cx = from.x + dx / 2 - dy * arc;
    const cy = from.y + dy / 2 + dx * arc;
    const steps = framesFor(duration);
    for (let i = 1; i <= steps; i++) {
      const t = easeInOutCubic(i / steps);
      const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cx + t * t * x;
      const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cy + t * t * y;
      await page.mouse.move(px, py);
      await clock.tick();
    }
    pos = { x, y };
  }

  /** Elliptical loop starting and ending at the ellipse's right edge, e.g. to show off a hover tilt. */
  async function orbit(x, y, { rx = 120, ry = 60, duration = 2400, turns = 1 } = {}) {
    const steps = framesFor(duration);
    for (let i = 1; i <= steps; i++) {
      // Ease the angle so the loop starts and ends without a jolt.
      const a = easeInOutCubic(i / steps) * Math.PI * 2 * turns;
      await page.mouse.move(x + Math.cos(a) * rx, y + Math.sin(a) * ry);
      await clock.tick();
    }
    pos = { x: x + rx, y };
  }

  return {
    moveTo,
    orbit,
    get position() {
      return pos;
    },
    async click() {
      await page.mouse.down();
      await clock.wait(90);
      await page.mouse.up();
    },
  };
}
