/// <reference types="vitest/config" />
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import manifest from './manifest.config.js'
import { name, version } from './package.json' with { type: 'json' }
import { resolve } from 'path';
import { tmpdir } from 'os';

const debug = process.env.__DEV__ === 'true';
const sourceRoot = resolve(import.meta.dirname, 'src');

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: [resolve(sourceRoot, 'test/setup.ts')],
    execArgv: [
      '--localstorage-file',
      resolve(tmpdir(), './tmp-localstorage.json'),
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/core/hooks/__tests__/'],
    },
  },
  resolve: {
    alias: {
      '@src': sourceRoot,
      '@core': resolve(sourceRoot, 'core'),
      '@popup': resolve(sourceRoot, 'popup'),
      '@sidepanel': resolve(sourceRoot, 'sidepanel'),
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    sourcemap: debug,
    minify: !debug,
    cssMinify: !debug,
    emptyOutDir: false,
  },
  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
})
