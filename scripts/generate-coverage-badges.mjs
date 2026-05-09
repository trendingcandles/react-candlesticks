import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatPct(value) {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded.toFixed(2)}%`;
}

function measureWidth(text) {
  return Math.max(48, Math.round(text.length * 6.8 + 12));
}

function createBadgeSvg(label, value, color) {
  const escapedLabel = escapeXml(label);
  const escapedValue = escapeXml(value);
  const iconAreaWidth = 24;
  const labelTrailingPadding = 8;
  const labelTextAreaWidth = measureWidth(label);
  const labelWidth = iconAreaWidth + labelTextAreaWidth + labelTrailingPadding;
  const valueWidth = measureWidth(value);
  const totalWidth = labelWidth + valueWidth;
  const labelCenter = iconAreaWidth + labelTextAreaWidth / 2;
  const valueCenter = labelWidth + valueWidth / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${escapedLabel}: ${escapedValue}"><title>${escapedLabel}: ${escapedValue}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${labelWidth}" height="20" fill="#555"/><rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/><rect width="${totalWidth}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><image x="5" y="3" width="14" height="14" href="data:image/svg+xml;base64,${ICON_SVG_BASE64}"/><text aria-hidden="true" x="${Math.round(labelCenter * 10)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${Math.round(labelTextAreaWidth * 10)}">${escapedLabel}</text><text x="${Math.round(labelCenter * 10)}" y="140" transform="scale(.1)" fill="#fff" textLength="${Math.round(labelTextAreaWidth * 10)}">${escapedLabel}</text><text aria-hidden="true" x="${Math.round(valueCenter * 10)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${Math.round((valueWidth - 12) * 10)}">${escapedValue}</text><text x="${Math.round(valueCenter * 10)}" y="140" transform="scale(.1)" fill="#fff" textLength="${Math.round((valueWidth - 12) * 10)}">${escapedValue}</text></g></svg>`;
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
  const svg = createBadgeSvg(badge.label, pctText, pickColor(pct));
  await writeFile(path.join(BADGES_DIR, badge.file), svg, "utf8");
}

const totalPct = totalPctAccumulator / totalPctCount;
const totalSvg = createBadgeSvg("Coverage", formatPct(totalPct), pickColor(totalPct));
await writeFile(path.join(BADGES_DIR, "coverage-total.svg"), totalSvg, "utf8");

console.log("Coverage badges generated in badges/");
