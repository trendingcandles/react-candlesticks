#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const smokeDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(smokeDir, '..');
const fixtureDir = join(smokeDir, 'consumer-vite');

function run(command, args, cwd, env = {}) {
  execFileSync(command, args, {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    stdio: 'inherit',
  });
}

function ensurePackageSymlink(consumerNodeModulesDir, packageName) {
  const source = join(repoRoot, 'node_modules', ...packageName.split('/'));
  const destination = join(consumerNodeModulesDir, ...packageName.split('/'));

  mkdirSync(dirname(destination), { recursive: true });
  symlinkSync(source, destination, 'dir');
}

function collectFiles(dir, matches = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, matches);
    } else {
      matches.push(fullPath);
    }
  }

  return matches;
}

const tempRoot = mkdtempSync(join(tmpdir(), 'react-candlesticks-smoke-'));

try {
  const consumerDir = join(tempRoot, 'consumer');
  const consumerNodeModulesDir = join(consumerDir, 'node_modules');
  const packedPackageDir = join(consumerNodeModulesDir, 'react-candlesticks');
  const npmCacheDir = join(tempRoot, '.npm-cache');

  cpSync(fixtureDir, consumerDir, { recursive: true });
  mkdirSync(consumerNodeModulesDir, { recursive: true });
  mkdirSync(npmCacheDir, { recursive: true });

  run('npm', ['run', 'build'], repoRoot);
  run('npm', ['pack', '--pack-destination', tempRoot, '--cache', npmCacheDir], repoRoot);

  const tarballName = readdirSync(tempRoot).find((entry) => entry.endsWith('.tgz'));
  if (!tarballName) {
    throw new Error('Failed to locate the packed npm tarball for the smoke test.');
  }

  mkdirSync(packedPackageDir, { recursive: true });
  run(
    'tar',
    ['-xzf', join(tempRoot, tarballName), '-C', packedPackageDir, '--strip-components=1'],
    repoRoot,
    { LC_ALL: 'C', LANG: 'C' }
  );

  [
    'react',
    'react-dom',
    'vite',
    '@vitejs/plugin-react',
  ].forEach((packageName) => ensurePackageSymlink(consumerNodeModulesDir, packageName));

  run(process.execPath, [join(repoRoot, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], consumerDir);

  const distDir = join(consumerDir, 'dist');
  if (!existsSync(distDir)) {
    throw new Error('The consumer app build did not produce a dist directory.');
  }

  const cssFiles = collectFiles(distDir).filter((file) => file.endsWith('.css'));
  if (cssFiles.length === 0) {
    throw new Error('The consumer build did not emit any CSS assets.');
  }

  const cssBundle = cssFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
  if (!cssBundle.includes('cursor:crosshair')) {
    throw new Error('The emitted consumer CSS did not include the library stylesheet content.');
  }

  console.log(`Smoke test passed with ${cssFiles.length} emitted CSS asset(s).`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
