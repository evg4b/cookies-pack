import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { makeManifest } from './plugins';

const sourceRoot = resolve(__dirname, 'src');
const sharedDir = resolve(sourceRoot, 'shared');
const coreDir = resolve(sourceRoot, 'core');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': sourceRoot,
      '@core': coreDir,
      '@shared': sharedDir,
    },
  },
  plugins: [
    react(),
    makeManifest(),
  ],
  publicDir: publicDir,
  build: {
    outDir,
    sourcemap: process.env.__DEV__ === 'true',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(sourceRoot, 'popup', 'index.html'),
        options: resolve(sourceRoot, 'options', 'index.html'),
      },
      output: {
        entryFileNames: (chunk) => `src/${ chunk.name }/index.js`,
      },
    },
  },
});
