#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const requiredTypePaths = new Set();

if (packageJson.types) {
  requiredTypePaths.add(packageJson.types);
}

for (const exportEntry of Object.values(packageJson.exports ?? {})) {
  if (exportEntry && typeof exportEntry === 'object' && typeof exportEntry.types === 'string') {
    requiredTypePaths.add(exportEntry.types);
  }
}

const missingTypePaths = [...requiredTypePaths].filter((typePath) => {
  return !existsSync(resolve(repoRoot, typePath));
});

if (missingTypePaths.length > 0) {
  throw new Error(`Package declaration path(s) do not exist: ${missingTypePaths.join(', ')}`);
}

console.log(`Package declaration paths verified: ${[...requiredTypePaths].join(', ')}`);
