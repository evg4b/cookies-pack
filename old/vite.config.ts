import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { manifest } from './manifest';

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
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    sourcemap: debug,
    minify: !debug,
    cssMinify: !debug,
    emptyOutDir: false,
  },
});
