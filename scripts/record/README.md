# Scripted screen recordings

Produces X-ready MP4s (and optional GIFs, plus a still PNG) of app screens,
framed portfolio-style: the UI centred on a flat `#F6F6F6` grey, no radius or
shadow.

```bash
npm run dev                      # must be running (default http://localhost:3000)
npm run record brand-hero        # one shot
npm run record                   # every shot
npm run record -- --list
BASE_URL=http://localhost:3001 npm run record brand-hero
```

Output: `social/recordings/<shot>/` (gitignored)

| File | What |
|---|---|
| `<shot>.mp4` | Framed, 60fps H.264, capped to 1920×1200 for X |
| `<shot>-raw.mp4` | UI only, no frame |
| `<shot>.png` | Lossless framed still of the final state at 2×, cursor hidden |
| `<shot>.gif` | Only when the shot sets `gif` (pixel art) |

## Adding a shot

Add an entry to `shots.mjs`:

```js
"my-screen": {
  path: "/explore",
  viewport: { width: 1600, height: 1040 },  // CSS px; size it so the whole section fits
  cursorStart: { x: 1380, y: 1036 },       // near an edge so the cursor "enters"
  gif: false,                              // true / { width } for pixel art
  async run({ page, cursor, wait }) {
    await wait(1600);                                  // let entrance animations play
    const box = await page.locator("…").boundingBox(); // aim at real elements
    await cursor.moveTo(x, y, { duration: 1200, arc: -0.1 });
    await cursor.orbit(cx, cy, { rx, ry, duration: 2400 });
    await cursor.click();
    await wait(1400);                                  // hold the ending
  },
},
```

Only `wait()` and cursor calls advance time. Never use `setTimeout` or real
sleeps in a shot.

## How it works

### 1. Pick the viewport and frame

- Measure the section to record (Playwright `boundingBox()` at a few widths)
  and choose a viewport that contains it entirely. The brand hero is 1038px
  tall, so it uses 1600×1040.
- The frame padding is `56 / 1112` of the UI width, measured from the
  portfolio card. Canvas = UI + 2 × padding, scaled down to fit 1920×1200 if
  needed. 1600×1040 → 1760×1200.

### 2. Render frame by frame, not in real time

Real-time capture (Playwright `recordVideo` or a CDP screencast) drops frames
whenever painting is expensive. The WebGL shaders render in software headless,
so the first attempt captured about 17fps and stretched a 9s clip to 2 minutes.
Instead, time is frozen and stepped one frame at a time (`lib/capture.mjs`):

1. Launch Chromium at `deviceScaleFactor: 2` for sharp text.
2. **Warm-up visit** on the real clock (compiles the dev route, caches fonts and
   images), then go to `about:blank`.
3. **Freeze JS time:** `page.clock.install()` + `page.clock.pauseAt()`. This
   fakes rAF, `performance.now`, timers and `Date`, which drive Framer Motion
   and the shaders.
4. **Take over CSS and Web Animations**, which run on the real document
   timeline (init script `stepAnimationsScript`):
   - Patch `Element.prototype.animate` to pause every new animation at
     `currentTime = 0`.
   - Ignore `startTime` sets and `play()` on claimed animations. Framer Motion
     syncs `startTime` to its own clock, which is now fake. Without this, the
     browser treats the animation as long finished and entrances snap to their
     end state.
   - `window.__recStep(dt)` advances every `document.getAnimations()` by `dt`,
     claiming CSS transitions on sight. At the end it calls `finish()`, so the
     finished event fires and Framer commits its final styles.
5. **Each frame:** `page.clock.runFor(dt)` → `__recStep(dt)` → CDP
   `Page.captureScreenshot` (JPEG q95, `optimizeForSpeed`) → `00000.jpg`,
   `00001.jpg`, … `dt` uses whole-millisecond steps that average exactly
   1000/60.

Rendering takes about 3.5 min per 10s of video, and the output is a perfect
constant 60fps every time.

### 3. Cursor

Headless Chromium draws no pointer. An init script (`lib/cursor.mjs`) injects
a small SVG arrow that follows `mousemove`, and hides the Next.js dev indicator
(`nextjs-portal`). Moves follow eased quadratic-Bézier arcs, with one mouse
position per frame, so motion looks hand-made and stays in sync with the frame
clock.

### 4. Encode (`lib/encode.mjs`, ffmpeg)

```bash
# framed
ffmpeg -framerate 60 -i %05d.jpg \
  -vf "scale=1600:1040:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p,pad=1760:1200:80:80:color=0xF6F6F6" \
  -c:v libx264 -preset slow -crf 14 -profile:v high -pix_fmt yuv420p -movflags +faststart \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 out.mp4

# gif (pixel art): hard edges, no dithering
ffmpeg -framerate 60 -i %05d.jpg \
  -vf "fps=30,scale=800:-1:flags=neighbor,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=none" \
  -loop 0 out.gif
```

`out_range=tv` matters. JPEG frames are full range (`yuvj420p`), which X can
display with shifted greys.

### 5. Verify

- `ffprobe`: 60/1 fps, `yuv420p`, `tv` range, expected dimensions.
- Sample a frame-border pixel: it must decode to `f6f6f6`.
- Tile a contact sheet of frames to check that entrances animate (not
  snapped), the cursor path and hover states:
  `ffmpeg -i out.mp4 -vf "select='eq(n\,0)+eq(n\,10)+…',scale=500:-1,tile=3x2" -frames:v 1 sheet.png`

## Gotchas

- Reuse an already-running dev server; `next dev` refuses to start a second.
- Keep scratch or debug scripts out of the repo (use a temp dir). Playwright
  resolves from the project, so a script that must import it should live here
  only briefly.
- A component's own design shows up as-is: e.g. the brand hero's buttons have
  no entrance animation, and the metal ring's dark streaks are intentional.
