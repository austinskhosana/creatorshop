"use client";

import {
  ArrowPathIcon,
  ArrowUturnRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import Button from "@/components/atoms/Button/Button";
import { prepareAvatarImage, validateImageFile } from "@/lib/image-upload";
import { ModalSecondaryAction } from "./SettingsPrimitives";

/** Side of the crop window, in CSS pixels. */
const VIEWPORT = 280;
/** Side of the saved avatar, in image pixels. */
const OUTPUT = 400;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const PAN_STEP = 12;

type Crop = { zoom: number; x: number; y: number };
type Size = { width: number; height: number };

/** The crop that just covers the window with the photo centered. */
function centered(size: Size): Crop {
  const scale = VIEWPORT / Math.min(size.width, size.height);
  return { zoom: 1, x: (VIEWPORT - size.width * scale) / 2, y: (VIEWPORT - size.height * scale) / 2 };
}

/** The image turned a quarter turn clockwise. */
async function rotateQuarterTurn(image: HTMLImageElement): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalHeight;
  canvas.height = image.naturalWidth;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No canvas context");
  context.translate(canvas.width, 0);
  context.rotate(Math.PI / 2);
  context.drawImage(image, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Rotation failed");
  return blob;
}

/**
 * Lets the creator choose which part of a photo becomes their avatar: drag to move it, zoom with
 * the slider, buttons, scroll wheel, a pinch, or +/- keys, and rotate sideways phone photos.
 * The circle shows what will be kept.
 */
export function AvatarCropDialog({
  file,
  onApply,
  onCancel,
  onError,
}: {
  file: File;
  onApply: (dataUrl: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}) {
  const [sourceFile, setSourceFile] = useState(file);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<Size | null>(null);
  const [crop, setCrop] = useState<Crop>({ zoom: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  /** Animate button and key steps; wheel, pinch, slider and drag track the input directly. */
  const [easing, setEasing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    setNatural(null);
    setImageUrl(null);
    prepareAvatarImage(sourceFile)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      })
      .catch(() => {
        if (!cancelled) onError("That image couldn't be read. Try a PNG or JPG.");
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
    // onError is the parent's handler; re-preparing the photo when it changes identity would be wasted work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceFile]);

  // At zoom 1 the image just covers the window; every zoom level scales from there.
  const baseScale = natural ? VIEWPORT / Math.min(natural.width, natural.height) : 1;
  const ready = natural !== null && !busy;
  const start = natural ? centered(natural) : null;
  const isCentered = !start || (crop.zoom === 1 && Math.abs(crop.x - start.x) < 0.5 && Math.abs(crop.y - start.y) < 0.5);
  const transformTransition = easing && !reduceMotion ? "transform 180ms cubic-bezier(0.2, 0, 0, 1)" : "transform 0ms";

  /** Keeps the image covering the whole window, so the avatar never has empty edges. */
  const clamp = useCallback(
    ({ zoom, x, y }: Crop): Crop => {
      if (!natural) return { zoom, x, y };
      const width = natural.width * baseScale * zoom;
      const height = natural.height * baseScale * zoom;
      return {
        zoom,
        x: Math.min(0, Math.max(VIEWPORT - width, x)),
        y: Math.min(0, Math.max(VIEWPORT - height, y)),
      };
    },
    [natural, baseScale],
  );

  /** Zooms around a point in the window (its center by default), so that point stays put. */
  const zoomTo = useCallback(
    (nextZoom: number | ((zoom: number) => number), focus = { x: VIEWPORT / 2, y: VIEWPORT / 2 }) => {
      setCrop((current) => {
        const target = typeof nextZoom === "function" ? nextZoom(current.zoom) : nextZoom;
        const zoom = Math.min(MAX_ZOOM, Math.max(1, target));
        const ratio = zoom / current.zoom;
        return clamp({ zoom, x: focus.x - (focus.x - current.x) * ratio, y: focus.y - (focus.y - current.y) * ratio });
      });
    },
    [clamp],
  );

  /** A discrete change (button, key, reset) that eases into place. */
  function step(change: () => void) {
    setEasing(true);
    change();
  }

  function reset() {
    if (start) step(() => setCrop(start));
  }

  function handleLoad() {
    const image = imageRef.current;
    if (!image) return;
    const size = { width: image.naturalWidth, height: image.naturalHeight };
    setNatural(size);
    setEasing(false);
    setCrop(centered(size));
  }

  async function rotate() {
    const image = imageRef.current;
    if (!image || !ready) return;
    setBusy(true);
    try {
      const blob = await rotateQuarterTurn(image);
      setSourceFile(new File([blob], sourceFile.name, { type: blob.type }));
    } catch {
      onError("That photo couldn't be rotated. Try a different file.");
    } finally {
      setBusy(false);
    }
  }

  function replace(next: File | undefined) {
    setReplaceError(null);
    if (!next) return;
    const error = validateImageFile(next);
    if (error) setReplaceError(error);
    else setSourceFile(next);
  }

  useEffect(() => {
    viewportRef.current?.focus();
  }, []);

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onCancel]);

  // React's wheel listener is passive, so it can't stop the page scrolling while zooming.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    function zoomOnWheel(event: WheelEvent) {
      event.preventDefault();
      setEasing(false);
      const rect = viewport!.getBoundingClientRect();
      zoomTo((zoom) => zoom * Math.exp(-event.deltaY * 0.0015), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    }
    viewport.addEventListener("wheel", zoomOnWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", zoomOnWheel);
  }, [zoomTo]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!ready) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    pinchDistance.current = null;
    setEasing(false);
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDistance.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = distance / pinchDistance.current;
        zoomTo((zoom) => zoom * ratio, { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top });
      }
      pinchDistance.current = distance;
      return;
    }

    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    setCrop((current) => clamp({ ...current, x: current.x + dx, y: current.y + dy }));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    pinchDistance.current = null;
    if (pointers.current.size === 0) setDragging(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!ready) return;
    const pan: Record<string, [number, number]> = {
      ArrowLeft: [PAN_STEP, 0],
      ArrowRight: [-PAN_STEP, 0],
      ArrowUp: [0, PAN_STEP],
      ArrowDown: [0, -PAN_STEP],
    };
    if (pan[event.key]) {
      event.preventDefault();
      const [dx, dy] = pan[event.key];
      // Held arrow keys repeat fast; easing each repeat would make the photo lag behind.
      setEasing(!event.repeat);
      setCrop((current) => clamp({ ...current, x: current.x + dx, y: current.y + dy }));
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      step(() => zoomTo((zoom) => zoom + ZOOM_STEP));
    } else if (event.key === "-") {
      event.preventDefault();
      step(() => zoomTo((zoom) => zoom - ZOOM_STEP));
    } else if (event.key === "r" || event.key === "R") {
      event.preventDefault();
      void rotate();
    } else if (event.key === "0") {
      event.preventDefault();
      reset();
    }
  }

  function apply() {
    const image = imageRef.current;
    if (!image || !ready) return;
    const scale = baseScale * crop.zoom;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const context = canvas.getContext("2d");
    if (!context) return onError("That image couldn't be read. Try a different file.");
    context.imageSmoothingQuality = "high";
    // The prepared photo is already opaque; this is a backstop so a JPEG never gets black edges.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, OUTPUT, OUTPUT);
    context.drawImage(image, -crop.x / scale, -crop.y / scale, VIEWPORT / scale, VIEWPORT / scale, 0, 0, OUTPUT, OUTPUT);
    onApply(canvas.toDataURL("image/jpeg", 0.85));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-neutral-950/35 p-4"
      onPointerDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-crop-title"
        aria-describedby="avatar-crop-description"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0.15 } : { type: "spring", duration: 0.35, bounce: 0.2 }}
        className="w-full max-w-[22rem] rounded-[1.5rem] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-6"
      >
        <h2 id="avatar-crop-title" className="text-xl font-bold tracking-tight text-neutral-950">Adjust your photo</h2>
        <p id="avatar-crop-description" className="mt-1.5 text-sm leading-6 text-neutral-500">Drag to choose what shows in the circle, and zoom to frame it.</p>

        <div
          ref={viewportRef}
          role="application"
          aria-label="Photo crop area. Arrow keys move the photo, plus and minus zoom, R rotates, 0 resets."
          aria-busy={!ready}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          onDoubleClick={reset}
          style={{ width: VIEWPORT, height: VIEWPORT }}
          className={`relative mx-auto mt-5 touch-none overflow-hidden rounded-2xl bg-neutral-100 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${!ready ? "cursor-progress" : dragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {imageUrl ? (
            // A plain img: the crop needs the decoded pixels, which next/image's optimized copy won't give.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={imageUrl}
              ref={imageRef}
              src={imageUrl}
              alt=""
              draggable={false}
              onLoad={handleLoad}
              onError={() => onError("That image couldn't be read. Try a PNG or JPG.")}
              className="pointer-events-none absolute top-0 left-0 max-w-none origin-top-left"
              style={natural ? {
                width: natural.width * baseScale,
                height: natural.height * baseScale,
                transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.zoom})`,
                transition: transformTransition,
              } : { opacity: 0 }}
            />
          ) : null}

          {!natural ? (
            <div className="absolute inset-0 grid place-items-center">
              <span aria-hidden="true" className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700 motion-reduce:animate-none" />
              <span className="sr-only">Loading photo</span>
            </div>
          ) : null}

          {/* Thirds, only while dragging, to help line a face up without cluttering the view. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${dragging ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.55) 1px, transparent 1px)",
              backgroundSize: `${VIEWPORT / 3}px ${VIEWPORT / 3}px`,
              backgroundPosition: "-0.5px -0.5px",
            }}
          />
          {/* Dims everything outside the circle that becomes the avatar. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_9999px_rgba(255,255,255,0.72)]" />
        </div>

        <div className="mt-4 flex items-center gap-1.5">
          <IconButton label="Zoom out" disabled={!ready || crop.zoom <= 1} onClick={() => step(() => zoomTo((zoom) => zoom - ZOOM_STEP))}>
            <MagnifyingGlassMinusIcon className="size-5" />
          </IconButton>
          <input
            type="range"
            aria-label="Zoom"
            aria-valuetext={`${Math.round(crop.zoom * 100)}%`}
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={crop.zoom}
            disabled={!ready}
            onChange={(event) => { setEasing(false); zoomTo(Number(event.target.value)); }}
            className="h-10 min-w-0 flex-1 cursor-pointer accent-neutral-900 disabled:cursor-not-allowed"
          />
          <IconButton label="Zoom in" disabled={!ready || crop.zoom >= MAX_ZOOM} onClick={() => step(() => zoomTo((zoom) => zoom + ZOOM_STEP))}>
            <MagnifyingGlassPlusIcon className="size-5" />
          </IconButton>
        </div>

        <div className="mt-1 flex items-center justify-center gap-1">
          <TextButton disabled={!ready} onClick={() => void rotate()} icon={<ArrowUturnRightIcon className="size-4" />}>Rotate</TextButton>
          <TextButton disabled={!ready || isCentered} onClick={reset} icon={<ArrowPathIcon className="size-4" />}>Reset</TextButton>
          <TextButton disabled={busy} onClick={() => replaceInputRef.current?.click()} icon={<PhotoIcon className="size-4" />}>Replace</TextButton>
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              replace(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>

        {replaceError ? <p role="alert" className="mt-1 text-center text-xs text-red-600">{replaceError}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <ModalSecondaryAction onClick={onCancel}>Cancel</ModalSecondaryAction>
          <Button size="sm" variant="dark" disabled={!ready} onClick={apply}>Use photo</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IconButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 shrink-0 place-items-center rounded-xl text-neutral-700 transition-[background-color,transform] duration-150 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:active:scale-100"
    >
      {children}
    </button>
  );
}

function TextButton({ disabled, onClick, icon, children }: { disabled: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-neutral-700 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:active:scale-100"
    >
      {icon}
      {children}
    </button>
  );
}
