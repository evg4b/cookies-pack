import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    16: 'public/icon-16.png',
    24: 'public/icon-24.png',
    32: 'public/icon-32.png',
    48: 'public/icon-48.png',
    64: 'public/icon-64.png',
    128: 'public/icon-128.png',
    256: 'public/icon-256.png',
    512: 'public/icon-512.png',
  },
  action: {
    default_icon: {
      16: 'public/icon-16.png',
      24: 'public/icon-24.png',
      32: 'public/icon-32.png',
      48: 'public/icon-48.png',
      64: 'public/icon-64.png',
      128: 'public/icon-128.png',
      256: 'public/icon-256.png',
      512: 'public/icon-512.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: [
    'sidePanel',
    'contentSettings',
  ],
  content_scripts: [{
    js: ['src/content/main.tsx'],
    matches: ['https://*/*'],
  }],
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
})
