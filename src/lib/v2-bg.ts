// Shared v2 background — tileable sine-wave SVG, generated once at build
// time and reused across all v2 pages. Each wave's period divides the tile
// width evenly so it seams cleanly when tiled.
export const WAVE_TILE_W = 600;
export const WAVE_TILE_H = 360;

const waves = [
  { y: 60, amp: 18, period: 300, phase: 0 },
  { y: 140, amp: 24, period: 600, phase: 1.05 },
  { y: 220, amp: 14, period: 200, phase: 2.5 },
  { y: 300, amp: 26, period: 600, phase: 4.4 },
];

const wavePaths = waves
  .map(({ y, amp, period, phase }) => {
    let d = `M0,${y}`;
    for (let x = 8; x <= WAVE_TILE_W; x += 8) {
      const wy = y + Math.sin((x / period) * Math.PI * 2 + phase) * amp;
      d += ` L${x},${wy.toFixed(1)}`;
    }
    return `<path d="${d}" stroke="#eee8df" stroke-width="0.6" fill="none"/>`;
  })
  .join("");

const waveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WAVE_TILE_W}" height="${WAVE_TILE_H}">${wavePaths}</svg>`;

export const waveBg = `url("data:image/svg+xml;utf8,${encodeURIComponent(waveSvg)}")`;

// Shared bento class strings used across v2 pages.
// Hairline border (`border border-cream/10`) gives every panel a subtle
// stroke that defines its edge on the black page canvas.
export const bentoCard =
  "relative bg-plum-darkest rounded-lg border border-cream/10 p-8 md:p-10 lg:p-12 h-full";
export const bentoHeading =
  "font-display text-3xl md:text-4xl leading-[1.05] tracking-tight text-cream";
export const labelBase =
  "font-sans text-[11px] tracking-[0.3em] uppercase mb-8";
