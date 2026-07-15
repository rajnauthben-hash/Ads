/**
 * Decomposes the 10 reference plates into independently animatable layers:
 *
 *   public/references/scene-XX.png            (1080x1920 Lanczos upscale)
 *   public/generated/scene-XX/header.png      (alpha-keyed text, full frame)
 *   public/generated/scene-XX/headline.png    (alpha-keyed text, full frame)
 *   public/generated/scene-XX/body.png        (alpha-keyed text, full frame)
 *   public/generated/scene-XX/artwork.png     (opaque plate, feathered top edge)
 *
 * Text bands are auto-detected from row-brightness profiles so the cuts never
 * slice through glyphs. Detected geometry is written to
 * src/config/plates.generated.ts for the Remotion composition to consume.
 *
 * Deterministic: no randomness, pure pixel math.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const W = 1080;
const H = 1920;

// Expected text-line cluster counts per scene: [headlineLines, bodyLines]
const EXPECTED = {
  1: { headline: 4, body: 1 },
  2: { headline: 2, body: 2 },
  3: { headline: 2, body: 2 },
  4: { headline: 3, body: 2 },
  5: { headline: 2, body: 2 },
  6: { headline: 2, body: 2 },
  7: { headline: 3, body: 2 },
  8: { headline: 2, body: 2 },
  9: { headline: 2, body: 2 },
  10: { headline: 3, body: 1 },
};

// Scenes whose artwork begins with elements too thin/sparse for the row
// detector (scene 05's scan divider, scene 07's panel border): pin the cut.
const CUT_OVERRIDE = { 5: 620, 7: 680 };

const root = path.resolve(import.meta.dirname, "..");
const refDir = path.join(root, "public", "references");
const genDir = path.join(root, "public", "generated");

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Row profile: fraction of pixels per row noticeably brighter than the
 * background gradient (which tops out around maxRGB ~24). */
const rowProfile = (data, width, height) => {
  const profile = new Float64Array(height);
  for (let y = 0; y < height; y++) {
    let count = 0;
    const rowStart = y * width * 4;
    for (let x = 0; x < width; x++) {
      const i = rowStart + x * 4;
      const m = Math.max(data[i], data[i + 1], data[i + 2]);
      if (m > 80) count++;
    }
    profile[y] = count / width;
  }
  return profile;
};

/** Contiguous bright clusters in the top part of the profile. */
const detectClusters = (profile, height) => {
  const THRESH = 0.008;
  const MERGE_GAP = 12;
  const MIN_HEIGHT = 12;
  const limit = Math.floor(height * 0.5);
  const raw = [];
  let start = -1;
  for (let y = 0; y < limit; y++) {
    const bright = profile[y] > THRESH;
    if (bright && start < 0) start = y;
    if (!bright && start >= 0) {
      raw.push([start, y - 1]);
      start = -1;
    }
  }
  if (start >= 0) raw.push([start, limit - 1]);
  const merged = [];
  for (const c of raw) {
    const prev = merged[merged.length - 1];
    if (prev && c[0] - prev[1] <= MERGE_GAP) prev[1] = c[1];
    else merged.push([...c]);
  }
  return merged.filter(([a, b]) => b - a >= MIN_HEIGHT);
};

/** Alpha-key a horizontal band: black -> transparent, preserve text color. */
const keyBand = (data, width, height, y0, y1) => {
  const out = Buffer.alloc(width * height * 4, 0);
  const lo = 26;
  const hi = 165;
  for (let y = Math.max(0, y0); y <= Math.min(height - 1, y1); y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const m = Math.max(r, g, b);
      const a = clamp((m - lo) / (hi - lo), 0, 1);
      if (a <= 0.004) continue;
      // Unpremultiply so antialiased edges keep their true hue.
      out[i] = clamp(Math.round(r / a), 0, 255);
      out[i + 1] = clamp(Math.round(g / a), 0, 255);
      out[i + 2] = clamp(Math.round(b / a), 0, 255);
      out[i + 3] = Math.round(a * 255);
    }
  }
  return out;
};

/**
 * Full-frame opaque artwork plate. Text bands are inpainted with a
 * column-wise vertical interpolation of the background rows bounding each
 * band, so the plate carries the reference's true background everywhere —
 * no feather seams against the composition backdrop, and the typography
 * layers reveal over clean background.
 */
const artworkPlate = (data, width, height, bands) => {
  const out = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) out[(y * width + x) * 4 + 3] = 255;
  }
  for (const [top, bottom] of bands) {
    const rowA = clamp(top - 3, 0, height - 1);
    const rowB = clamp(bottom + 3, 0, height - 1);
    for (let y = Math.max(0, top); y <= Math.min(height - 1, bottom); y++) {
      const t = (y - rowA) / Math.max(rowB - rowA, 1);
      for (let x = 0; x < width; x++) {
        const ia = (rowA * width + x) * 4;
        const ib = (rowB * width + x) * 4;
        const io = (y * width + x) * 4;
        out[io] = Math.round(data[ia] + (data[ib] - data[ia]) * t);
        out[io + 1] = Math.round(data[ia + 1] + (data[ib + 1] - data[ia + 1]) * t);
        out[io + 2] = Math.round(data[ia + 2] + (data[ib + 2] - data[ia + 2]) * t);
        out[io + 3] = 255;
      }
    }
  }
  return out;
};

const savePng = async (buf, file) =>
  sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(file);

const layout = {};

for (let scene = 1; scene <= 10; scene++) {
  const id = String(scene).padStart(2, "0");
  const rawFile = path.join(refDir, `raw-${id}.png`);
  const outRef = path.join(refDir, `scene-${id}.png`);
  const outDir = path.join(genDir, `scene-${id}`);
  mkdirSync(outDir, { recursive: true });

  const upscaled = await sharp(rawFile)
    .resize(W, H, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  writeFileSync(outRef, upscaled);

  const { data } = await sharp(upscaled).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const profile = rowProfile(data, W, H);
  const clusters = detectClusters(profile, H);
  const expected = EXPECTED[scene];
  const needed = 1 + expected.headline + expected.body;
  if (clusters.length < needed) {
    console.error(
      `scene ${id}: expected >= ${needed} text clusters, found ${clusters.length}:`,
      clusters.map(([a, b]) => `${a}-${b}`).join(", "),
    );
    process.exit(1);
  }

  const header = clusters[0];
  const headlineLines = clusters.slice(1, 1 + expected.headline);
  const bodyLines = clusters.slice(1 + expected.headline, needed);
  const lastText = bodyLines[bodyLines.length - 1][1];
  const nextContent = clusters[needed] ? clusters[needed][0] : lastText + 120;
  const cutY =
    CUT_OVERRIDE[scene] ??
    Math.round(Math.min(lastText + Math.max(24, (nextContent - lastText) / 2), nextContent - 8));

  const pad = 10;
  const headlineBand = [headlineLines[0][0] - pad, headlineLines.at(-1)[1] + pad];
  const bodyBand = [bodyLines[0][0] - pad, Math.min(bodyLines.at(-1)[1] + pad, cutY - 4)];

  await savePng(keyBand(data, W, H, header[0] - pad, header[1] + pad), path.join(outDir, "header.png"));
  await savePng(keyBand(data, W, H, headlineBand[0], headlineBand[1]), path.join(outDir, "headline.png"));
  await savePng(keyBand(data, W, H, bodyBand[0], bodyBand[1]), path.join(outDir, "body.png"));
  const inpaintBands = [
    [header[0] - pad, header[1] + pad],
    ...headlineLines.map(([a, b]) => [a - 8, b + 8]),
    ...bodyLines.map(([a, b]) => [a - 8, b + 8]),
  ];
  await savePng(artworkPlate(data, W, H, inpaintBands), path.join(outDir, "artwork.png"));

  layout[scene] = {
    header: [header[0] - pad, header[1] + pad],
    headlineLines: headlineLines.map(([a, b]) => [a - 6, b + 6]),
    bodyLines: bodyLines.map(([a, b]) => [a - 6, b + 6]),
    cutY,
  };
  console.log(
    `scene ${id}: header ${header[0]}-${header[1]}, headline ${headlineLines
      .map(([a, b]) => `${a}-${b}`)
      .join(" | ")}, body ${bodyLines.map(([a, b]) => `${a}-${b}`).join(" | ")}, cut ${cutY}`,
  );
}

const ts = `// AUTO-GENERATED by scripts/build-reference-layers.mjs — do not edit by hand.
// Pixel bands in 1080x1920 space: [top, bottom] per text line, artwork cut line.

export interface SceneLayout {
  header: [number, number];
  headlineLines: [number, number][];
  bodyLines: [number, number][];
  cutY: number;
}

export const PLATE_LAYOUT: Record<number, SceneLayout> = ${JSON.stringify(layout, null, 2)};
`;
writeFileSync(path.join(root, "src", "config", "plates.generated.ts"), ts);
console.log("wrote src/config/plates.generated.ts");
