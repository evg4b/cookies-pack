import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import makeManifest from './utils/plugins/make-manifest';
import { outputFolderName } from './utils/constants';

const root = resolve(__dirname, 'src');
const assetsDir = resolve(root, 'assets');
const sharedDir = resolve(root, 'shared');
const coreDir = resolve(root, 'core');
const outDir = resolve(__dirname, outputFolderName);
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@core': coreDir,
      '@shared': sharedDir,
    },
  },
  plugins: [
    react(),
    makeManifest(),
  ],
  publicDir,
  build: {
    outDir,
    sourcemap: process.env.__DEV__ === 'true',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup', 'index.html'),
        options: resolve(root, 'options', 'index.html'),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${ chunk.name }/index.js`,
      },
    },
  },
});
