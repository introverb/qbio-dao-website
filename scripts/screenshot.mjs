// Quick full-page screenshot of a local dev URL via Playwright.
// Usage: node scripts/screenshot.mjs <url> <out.png> [width] [scale]
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:4321/science-v2";
const out = process.argv[3] ?? "science-v2-full.png";
const width = Number(process.argv[4] ?? 1440);
const scale = Number(process.argv[5] ?? 2);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height: 900 },
  deviceScaleFactor: scale,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
// extra wait so any fonts / huge SVGs settle
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`Saved ${out}`);
