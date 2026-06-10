// Shared "dot-graphic" hero renderer.
//
// Reads a source image's alpha channel (or its edges) at build time and
// produces an inline SVG: each sampled pixel becomes one of a mixed field
// of small shapes (circles, squares, short horizontal traces, short
// vertical traces). Each shape's size scales with the sampled intensity;
// the shape *type* is picked by a deterministic position-based hash so the
// pattern stays stable across rebuilds and feels organic rather than
// uniform halftone.
//
// First used for the science page neuron; reused for the token page coin
// and the community page chain so all three hero graphics share one
// visual language. The source can be a file path (PNG) or an in-memory
// Buffer (PNG or SVG markup), so pages can also synthesize a stencil at
// build time when no suitable raster source exists.
import sharp from "sharp";

export interface DotGraphicOptions {
  /** Distance between sampled pixels (lower = denser pattern). Default 5. */
  sampleStep?: number;
  /** Pixels with sampled value below this are skipped. Default 20 / 255. */
  alphaThreshold?: number;
  /** Stroke/fill color for all shapes. Default cream (`#eee8df`). */
  color?: string;
  /**
   * What to sample at each pixel:
   * - `"alpha"` (default) — the source's own alpha channel. Works when the
   *   image is a silhouette on transparent background (e.g. the neuron).
   * - `"edge"` — runs a Laplacian edge-detection convolution first and
   *   samples the resulting edge strength. Use for sources whose meaningful
   *   structure is in the luminance, not the alpha.
   */
  mode?: "alpha" | "edge";
}

interface ShapesResult {
  shapes: string[];
  width: number;
  height: number;
}

async function computeShapes(
  source: string | Buffer,
  options: DotGraphicOptions,
): Promise<ShapesResult> {
  const sampleStep = options.sampleStep ?? 5;
  const alphaThreshold = options.alphaThreshold ?? 20;
  const mode = options.mode ?? "alpha";

  const img =
    mode === "edge"
      ? await sharp(source)
          .greyscale()
          .convolve({
            width: 3,
            height: 3,
            kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
          })
          .raw()
          .toBuffer({ resolveWithObject: true })
      : await sharp(source)
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
  const sampleOffset = mode === "edge" ? 0 : 3;

  const W = img.info.width;
  const H = img.info.height;
  const CH = img.info.channels;

  const shapes: string[] = [];
  for (let y = 0; y < H; y += sampleStep) {
    for (let x = 0; x < W; x += sampleStep) {
      const idx = (y * W + x) * CH;
      const a = img.data[idx + sampleOffset];
      if (a < alphaThreshold) continue;

      // Intensity 0..1 from sampled value
      const t = (a - alphaThreshold) / (255 - alphaThreshold);

      // Deterministic shape roll based on position so it stays stable
      // across rebuilds and the pattern feels organic rather than
      // perfectly grid-aligned.
      const roll = ((x * 7919 + y * 1009 + 31) % 100) / 100;

      let shape: string;
      if (roll < 0.55) {
        // Dominant: small circles, size scales with intensity
        const r = (0.4 + t * 2.6).toFixed(2);
        shape = `<circle cx="${x}" cy="${y}" r="${r}"/>`;
      } else if (roll < 0.74) {
        // Tiny solid squares
        const s = 1.0 + t * 2.3;
        shape = `<rect x="${(x - s / 2).toFixed(2)}" y="${(y - s / 2).toFixed(2)}" width="${s.toFixed(2)}" height="${s.toFixed(2)}"/>`;
      } else if (roll < 0.88) {
        // Short horizontal traces (circuit feel)
        const w = 3 + t * 4.5;
        const h = 0.9;
        shape = `<rect x="${(x - w / 2).toFixed(2)}" y="${(y - h / 2).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}"/>`;
      } else {
        // Short vertical traces
        const w = 0.9;
        const h = 3 + t * 4.5;
        shape = `<rect x="${(x - w / 2).toFixed(2)}" y="${(y - h / 2).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}"/>`;
      }
      shapes.push(shape);
    }
  }

  return { shapes, width: W, height: H };
}

function wrapSvg(result: ShapesResult, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${result.width} ${result.height}" preserveAspectRatio="xMidYMid meet" width="100%" height="auto" fill="${color}" aria-hidden="true">${result.shapes.join("")}</svg>`;
}

export async function dotGraphic(
  source: string | Buffer,
  options: DotGraphicOptions = {},
): Promise<string> {
  const color = options.color ?? "#eee8df";
  const result = await computeShapes(source, options);
  return wrapSvg(result, color);
}

export interface DotGraphicLayeredOptions {
  /** Stroke/fill color for all shapes. Default cream (`#eee8df`). */
  color?: string;
  /** Sample step for the body fill layer (alpha). Default 14 (sparse). */
  fillSampleStep?: number;
  /** Alpha threshold for the body fill layer. Default 80. */
  fillAlphaThreshold?: number;
  /** Sample step for the edge layer. Default 4 (dense). */
  edgeSampleStep?: number;
  /** Edge-strength threshold for the edge layer. Default 8. */
  edgeAlphaThreshold?: number;
}

/**
 * Two-layer variant for sources that are *solid* shapes with internal
 * structure (the 3D-rendered QBIO coin: an opaque disc whose rim, hex
 * stamp, and accents are visible only as edges). Combines:
 *   1) a sparse alpha-sampled body fill so the silhouette reads as a coin,
 *   2) a dense edge-sampled detail layer so the rim + hex + accents pop.
 */
export async function dotGraphicLayered(
  source: string | Buffer,
  options: DotGraphicLayeredOptions = {},
): Promise<string> {
  const color = options.color ?? "#eee8df";
  const fill = await computeShapes(source, {
    mode: "alpha",
    sampleStep: options.fillSampleStep ?? 14,
    alphaThreshold: options.fillAlphaThreshold ?? 80,
  });
  const edges = await computeShapes(source, {
    mode: "edge",
    sampleStep: options.edgeSampleStep ?? 4,
    alphaThreshold: options.edgeAlphaThreshold ?? 8,
  });
  return wrapSvg(
    {
      shapes: [...fill.shapes, ...edges.shapes],
      width: fill.width,
      height: fill.height,
    },
    color,
  );
}
