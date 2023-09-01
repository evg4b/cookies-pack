import * as fs from 'fs';
import { resolve } from 'path';
import type { PluginOption } from 'vite';
import manifest from '../src/manifest';

export function makeManifest(outDir: string): PluginOption {
  return {
    name: 'make-manifest',
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      const manifestPath = resolve(outDir, 'manifest.json');

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.info(`Manifest file copy complete: ${ manifestPath }`);
    },
  };
}
