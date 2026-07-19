import { gzipSync } from "node:zlib";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createBadgeSvg } from "./badge-svg.mjs";

const BADGES_DIR = path.resolve("badges");
const DIST_DIR = path.resolve("dist");
const PACKAGE_JSON_PATH = path.resolve("package.json");

const COLOR_BLUE = "#3178c6";
const COLOR_GREEN = "#4c1";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;

  const kib = bytes / 1024;
  if (kib < 1024) return `${Math.round(kib)} kB`;

  return `${Math.round((kib / 1024) * 10) / 10} MB`;
}

async function getTopLevelRuntimeFiles() {
  const entries = await readdir(DIST_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /\.(?:js|css)$/.test(entry.name))
    .map((entry) => path.join(DIST_DIR, entry.name))
    .sort();
}

async function calculateMinzipSize() {
  const runtimeFiles = await getTopLevelRuntimeFiles();
  if (runtimeFiles.length === 0) {
    throw new Error("No top-level JS or CSS files found in dist. Run npm run build first.");
  }

  let total = 0;
  for (const file of runtimeFiles) {
    const contents = await readFile(file);
    total += gzipSync(contents, { level: 9 }).byteLength;
  }

  return total;
}

const packageJson = JSON.parse(await readFile(PACKAGE_JSON_PATH, "utf8"));
const version = packageJson.version;
if (!version) {
  throw new Error("package.json is missing a version");
}

const minzipSize = await calculateMinzipSize();

await mkdir(BADGES_DIR, { recursive: true });
await writeFile(
  path.join(BADGES_DIR, "npm-version.svg"),
  createBadgeSvg("npm", `v${version}`, COLOR_BLUE),
  "utf8"
);
await writeFile(
  path.join(BADGES_DIR, "bundle-minzip.svg"),
  createBadgeSvg("minzip", formatBytes(minzipSize), COLOR_GREEN),
  "utf8"
);

console.log(`Package badges generated in badges/ (version v${version}, minzip ${formatBytes(minzipSize)})`);
