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
  'const NestedApp = () => <Chart data={exampleData} grid={{  }} scaleSmoothing={{  }} />;',
  'void App;',
  'void NestedApp;',
  'void exampleData;',
  '',
].join('\n');
const completionPosition = virtualConsumerSource.indexOf('<Chart  />') + '<Chart '.length;
const gridCompletionPosition = virtualConsumerSource.indexOf('grid={{  }}') + 'grid={{ '.length;
const scaleSmoothingCompletionPosition =
  virtualConsumerSource.indexOf('scaleSmoothing={{  }}') + 'scaleSmoothing={{ '.length;
const requiredChartPropCompletions = [
  'crosshairs',
  'data',
  'granularity',
  'grid',
  'height',
  'onViewportChange',
  'panels',
  'scaleSmoothing',
  'theme',
  'width',
  'xAxis',
];
const requiredGridPropCompletions = ['time', 'value'];
const requiredScaleSmoothingPropCompletions = ['durationMs', 'enabled', 'expandImmediate'];
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
const getCompletionNames = (position) => {
  const completions = languageService.getCompletionsAtPosition(
    virtualConsumerPath,
    position,
    {
      includeCompletionsForModuleExports: false,
      includeCompletionsWithInsertText: true,
    },
  );

  return new Set((completions?.entries ?? []).map((entry) => entry.name));
};
const assertCompletions = (label, completionNames, requiredCompletions) => {
  const missingCompletions = requiredCompletions.filter((prop) => {
    return !completionNames.has(prop);
  });

  if (missingCompletions.length > 0) {
    throw new Error(`${label} completion(s) missing: ${missingCompletions.join(', ')}`);
  }

  console.log(`${label} completions verified: ${requiredCompletions.join(', ')}`);
};

assertCompletions(
  'Chart JSX prop',
  getCompletionNames(completionPosition),
  requiredChartPropCompletions,
);
assertCompletions(
  'Chart grid config prop',
  getCompletionNames(gridCompletionPosition),
  requiredGridPropCompletions,
);
assertCompletions(
  'Chart scaleSmoothing config prop',
  getCompletionNames(scaleSmoothingCompletionPosition),
  requiredScaleSmoothingPropCompletions,
);

const unexpectedDiagnostics = languageService.getSemanticDiagnostics(virtualConsumerPath).filter((diagnostic) => {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');

  return !message.includes("Property 'data' is missing") &&
    !message.includes("Type '{}' is not assignable");
});

if (unexpectedDiagnostics.length > 0) {
  throw new Error(
    unexpectedDiagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '))
      .join('\n'),
  );
}
