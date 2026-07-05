import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import manifest from './manifest.config.js'
import { name, version } from './package.json'
import { resolve } from 'path';

const debug = process.env.__DEV__ === 'true';
const sourceRoot = resolve(__dirname, 'src');

export default defineConfig({
  resolve: {
    alias: {
      '@src': sourceRoot,
      '@core': resolve(sourceRoot, 'core'),
      '@shared': resolve(sourceRoot, 'shared'),
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
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
