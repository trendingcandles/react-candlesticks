#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

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

const virtualConsumerPath = resolve(repoRoot, '__react_candlesticks_virtual_consumer.tsx');
const virtualConsumerSource = [
  "import { Chart, exampleData } from 'react-candlesticks';",
  'const App = () => <Chart  />;',
  'void App;',
  'void exampleData;',
  '',
].join('\n');
const completionPosition = virtualConsumerSource.indexOf('<Chart  />') + '<Chart '.length;
const requiredChartPropCompletions = [
  'data',
  'granularity',
  'height',
  'onViewportChange',
  'panels',
  'theme',
  'width',
];
const virtualFiles = new Map([[virtualConsumerPath, virtualConsumerSource]]);
const compilerOptions = {
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  target: ts.ScriptTarget.ES2022,
};
const languageServiceHost = {
  directoryExists: ts.sys.directoryExists,
  fileExists: ts.sys.fileExists,
  getCompilationSettings: () => compilerOptions,
  getCurrentDirectory: () => repoRoot,
  getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  getDirectories: ts.sys.getDirectories,
  getScriptFileNames: () => [virtualConsumerPath],
  getScriptSnapshot: (fileName) => {
    const virtualFile = virtualFiles.get(fileName);

    if (virtualFile !== undefined) {
      return ts.ScriptSnapshot.fromString(virtualFile);
    }

    if (!ts.sys.fileExists(fileName)) {
      return undefined;
    }

    return ts.ScriptSnapshot.fromString(ts.sys.readFile(fileName));
  },
  getScriptVersion: () => '1',
  readDirectory: ts.sys.readDirectory,
  readFile: ts.sys.readFile,
  realpath: ts.sys.realpath,
};
const languageService = ts.createLanguageService(languageServiceHost);
const completions = languageService.getCompletionsAtPosition(
  virtualConsumerPath,
  completionPosition,
  {
    includeCompletionsForModuleExports: false,
    includeCompletionsWithInsertText: true,
  },
);
const completionNames = new Set((completions?.entries ?? []).map((entry) => entry.name));
const missingChartPropCompletions = requiredChartPropCompletions.filter((prop) => {
  return !completionNames.has(prop);
});

if (missingChartPropCompletions.length > 0) {
  throw new Error(`Chart JSX prop completion(s) missing: ${missingChartPropCompletions.join(', ')}`);
}

console.log(`Chart JSX prop completions verified: ${requiredChartPropCompletions.join(', ')}`);
