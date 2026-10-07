/**
 * Each shot is one screen. The recorder navigates to `path` with
 * the frame clock frozen, then calls `run` to choreograph the cursor.
 * `wait(ms)` and cursor moves advance time; nothing else does.
 *
 * - viewport: CSS pixels; captured at 2× DPR and framed on the portfolio grey.
 * - cursorStart: where the (hidden) pointer sits before its first move.
 * - gif: also export a GIF (pixel-art pieces only).
 */
const DRAWING_SHOTS = [
  "genie-lamp",
  "money-stack",
  "empty-cart",
  "empty-chat",
  "empty-search",
  "empty-bag",
  "empty-storefront",
  "empty-box",
  "empty-bell",
  "wishing-star",
  "empty-envelope",
  "empty-compass",
];

function drawingShot(piece) {
  return {
    path: `/showcase/drawings?piece=${piece}`,
    viewport: { width: 1080, height: 1080 },
    cursorStart: { x: -80, y: -80 },
    async run({ page, wait }) {
      await page.locator(`[data-recording-stage="${piece}"]`).waitFor();
      await wait(5600);
    },
  };
}

export const SHOTS = {
  "brand-hero": {
    path: "/brands",
    viewport: { width: 1600, height: 1040 },
    cursorStart: { x: 1380, y: 1036 },
    async run({ page, cursor, wait }) {
      // Let the staggered entrance and the mesh gradient settle in.
      await wait(1600);

      const card = await page.locator("section img[alt^='Creatorshop brand card']").boundingBox();
      const cx = card.x + card.width / 2;
      const cy = card.y + card.height / 2;

      // Drift in from the lower right and play with the card's tilt.
      await cursor.moveTo(cx + card.width * 0.32, cy + card.height * 0.1, { duration: 1300, arc: -0.1 });
      await wait(250);
      await cursor.orbit(cx, cy, { rx: card.width * 0.32, ry: card.height * 0.28, duration: 2600 });
      await cursor.moveTo(cx - card.width * 0.3, cy - card.height * 0.25, { duration: 700, arc: 0.15 });
      await wait(300);

      // Ease off the card and let it settle back flat.
      await cursor.moveTo(card.x + card.width + 220, card.y - 60, { duration: 1100, arc: -0.12 });
      await wait(1400);
    },
  },
  ...Object.fromEntries(DRAWING_SHOTS.map((piece) => [`drawing-${piece}`, drawingShot(piece)])),
};
