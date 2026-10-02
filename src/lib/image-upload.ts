/**
 * Scales an uploaded image down and encodes it as a JPEG data URL, small enough to keep in
 * localStorage. Goes away once uploads land in real storage.
 */
export async function readImageAsDataUrl(file: File, { maxSize }: { maxSize: number }): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (context) {
    // JPEG has no transparency: without a backdrop, see-through pixels come out black.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  }
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

type Rgba = [number, number, number, number];

const AVATAR_SOURCE_MAX = 1600;
/** How alike the corner samples must be to count as a flat backdrop rather than photo content. */
const CORNER_TOLERANCE = 12;
/** How different the corners must be from the edge of the circle to count as a separate backdrop. */
const CORNER_CONTRAST = 40;

function distance(a: Rgba, b: Rgba) {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]), Math.abs(a[3] - b[3]));
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/**
 * Many profile pictures exported from other apps are already round: a circle on flat black or white
 * corners. Cropped to our circle, those corners bleed in as a dark or hard outline. Returns the color
 * just inside the circle when the image looks like one, so the corners can take it. Expects opaque pixels.
 */
function findRoundedBackdropFill(data: Uint8ClampedArray, width: number, height: number): Rgba | null {
  if (Math.abs(width - height) / Math.max(width, height) > 0.03) return null;
  const at = (x: number, y: number): Rgba => {
    const index = (Math.round(y) * width + Math.round(x)) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };
  const radius = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height / 2;

  // Points well outside the inscribed circle, in all four corners.
  const reach = radius * 0.2;
  const offsets = [[2, 2], [reach, 2], [2, reach], [reach, reach]];
  const corners = offsets.flatMap(([dx, dy]) => [
    at(dx, dy),
    at(width - 1 - dx, dy),
    at(dx, height - 1 - dy),
    at(width - 1 - dx, height - 1 - dy),
  ]);
  if (corners.some((sample) => distance(sample, corners[0]) > CORNER_TOLERANCE)) return null;

  const rim: Rgba[] = [];
  for (let step = 0; step < 32; step += 1) {
    const angle = (step / 32) * Math.PI * 2;
    rim.push(at(cx + (radius - 6) * Math.cos(angle), cy + (radius - 6) * Math.sin(angle)));
  }
  const fill: Rgba = [0, 1, 2].map((channel) => median(rim.map((sample) => sample[channel]))).concat(255) as Rgba;
  return distance(corners[0], fill) > CORNER_CONTRAST ? fill : null;
}

/**
 * Gets an uploaded photo ready for the avatar crop, so the circle never picks up a dark edge the
 * creator didn't choose: scales big photos down, fills the corners of already-round pictures with
 * the color at their rim, and flattens any transparency, which a JPEG avatar would turn black.
 */
export async function prepareAvatarImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, AVATAR_SOURCE_MAX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("No canvas context");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const image = context.getImageData(0, 0, width, height);
  const { data } = image;

  // JPEG has no transparency, so see-through pixels would come out black. Settle them on white.
  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3] / 255;
    if (alpha === 1) continue;
    for (let channel = 0; channel < 3; channel += 1) {
      data[index + channel] = Math.round(data[index + channel] * alpha + 255 * (1 - alpha));
    }
    data[index + 3] = 255;
  }

  const fill = findRoundedBackdropFill(data, width, height);
  if (fill) {
    // From just inside the old circle's edge, so its anti-aliasing goes too.
    const cleanFrom = Math.min(width, height) / 2 - 2;
    const cx = (width - 1) / 2;
    const cy = (height - 1) / 2;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (Math.hypot(x - cx, y - cy) <= cleanFrom) continue;
        const index = (y * width + x) * 4;
        data[index] = fill[0];
        data[index + 1] = fill[1];
        data[index + 2] = fill[2];
      }
    }
  }
  context.putImageData(image, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Couldn't encode the photo");
  return blob;
}

/** The same limits the cover upload enforces, as a message, or null when the file is fine. */
export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Choose a PNG, JPG, WebP, GIF, or other image file.";
  if (file.size > 10 * 1024 * 1024) return "That image is over 10 MB. Choose a smaller file.";
  return null;
}
