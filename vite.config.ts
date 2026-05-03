import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import banner from 'vite-plugin-banner';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['lib'],
      exclude: ['**/__tests__/**', '**/*.test.tsx', '**/*.test.ts'],
    }),
    banner({
      content: `/*
 * Copyright (c) ${new Date().getFullYear()} Jason Wilson, trendingcandles.com
 * Licensed under the MIT License
 * Build time: ${new Date().toISOString()}
 */`,
      outDir: './dist'
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'lib/index.ts'),
        propTypes: resolve(__dirname, 'lib/propTypes.ts'),
      },
      name: 'react-candlesticks',
      formats: ['es'],
      fileName: (format, entryName) => {
        if (format === 'es') return `${entryName}.js`;
        return `${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      // Externalize peer deps (they won't be bundled)
      external: [
        'prop-types',
        'react', 
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage",
      exclude: [
        'dist/',
        'eslint.config.js',
        'vite.config.ts',
        'src/App.tsx',
        'src/main.tsx',
        'src/examples/',
        'src/testData/',
        'src/test/',
        'src/vite-env.d.ts',
        'demo/',
        'lib/exampleData/',
        'scripts/',
      ],
    },
  },
});
