import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createBadgeSvg } from "./badge-svg.mjs";

const COVERAGE_SUMMARY_PATH = path.resolve("coverage/coverage-summary.json");
const BADGES_DIR = path.resolve("badges");

const ICON_SVG_BASE64 =
  "PHN2ZyBmaWxsPSIjMDBGRjc0IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Vml0ZXN0PC90aXRsZT48cGF0aCBkPSJNMTEuNTQ1IDIzLjNhLjYxMy42MTMgMCAwIDEtLjg5NS4xOTdMLjI1MiAxNS45MzZBLjYxLjYxIDAgMCAxIDAgMTUuNDM5VjYuMzI1YzAtLjUwMi41NjktLjc5Mi45NzUtLjQ5N2w2LjM1OCA0LjYyNGMuNTk0LjQzMyAxLjQzMi4yNSAxLjc5My0uMzlMMTQuMzkzLjdhLjYyLjYyIDAgMCAxIC41MzUtLjMxNGg4LjQ1NWEuNjEzLjYxMyAwIDAgMSAuNTM3LjkxNnoiLz48L3N2Zz4=";

const badges = [
  { key: "branches", label: "Coverage", file: "coverage-branches.svg" },
  { key: "functions", label: "Coverage", file: "coverage-functions.svg" },
  { key: "lines", label: "Coverage", file: "coverage-lines.svg" },
  { key: "statements", label: "Coverage", file: "coverage-statements.svg" },
];

const COLOR_DEFAULT = "#9f9f9f";
const COLOR_LOW = "#e05d44";
const COLOR_MEDIUM = "#dfb317";
const COLOR_HIGH = "#4c1";

function pickColor(pct) {
  if (!Number.isFinite(pct)) return COLOR_DEFAULT;
  if (pct < 80) return COLOR_LOW;
  if (pct < 90) return COLOR_MEDIUM;
  return COLOR_HIGH;
}

function formatPct(value) {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded.toFixed(2)}%`;
}

const summaryRaw = await readFile(COVERAGE_SUMMARY_PATH, "utf8");
const summary = JSON.parse(summaryRaw);
const total = summary?.total;

if (!total) {
  throw new Error("coverage-summary.json is missing a total section");
}

await mkdir(BADGES_DIR, { recursive: true });

let totalPctAccumulator = 0;
let totalPctCount = 0;

for (const badge of badges) {
  const pct = Number(total?.[badge.key]?.pct);
  if (!Number.isFinite(pct)) {
    throw new Error(`Missing coverage metric: ${badge.key}`);
  }
  totalPctAccumulator += pct;
  totalPctCount += 1;

  const pctText = formatPct(pct);
  const svg = createBadgeSvg(badge.label, pctText, pickColor(pct), { iconSvgBase64: ICON_SVG_BASE64 });
  await writeFile(path.join(BADGES_DIR, badge.file), svg, "utf8");
}

const totalPct = totalPctAccumulator / totalPctCount;
const totalSvg = createBadgeSvg("Coverage", formatPct(totalPct), pickColor(totalPct), { iconSvgBase64: ICON_SVG_BASE64 });
await writeFile(path.join(BADGES_DIR, "coverage-total.svg"), totalSvg, "utf8");

console.log("Coverage badges generated in badges/");
