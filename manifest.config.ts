import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

const debug = process.env.__DEV__ === 'true';

const image = (fileName: string) => {
  if (!debug) {
    return fileName;
  }

  const [name, ext] = fileName.split('.');

  return `${ name }.dev.${ ext }`;
};

export default defineManifest({
  manifest_version: 3,
  name: debug ? `DEV: __MSG_extension_name__` : '__MSG_extension_name__',
  default_locale: 'en',
  description: '__MSG_extension_description__',
  homepage_url: 'https://github.com/evg4b/cookies-pack',
  version: pkg.version,
  icons: {
    16: image('public/icon-16.png'),
    24: image('public/icon-24.png'),
    32: image('public/icon-32.png'),
    48: image('public/icon-48.png'),
    64: image('public/icon-64.png'),
    128: image('public/icon-128.png'),
    256: image('public/icon-256.png'),
    512: image('public/icon-512.png'),
  },
  action: {
    default_icon: {
      16: image('public/icon-16.png'),
      24: image('public/icon-24.png'),
      32: image('public/icon-32.png'),
      48: image('public/icon-48.png'),
      64: image('public/icon-64.png'),
      128: image('public/icon-128.png'),
      256: image('public/icon-256.png'),
      512: image('public/icon-512.png'),
    },
    default_popup: 'src/popup/index.html',
    default_title: '__MSG_extension_title__',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  options_ui: {
    page: 'src/options/index.html',
    open_in_tab: false,
  },
  permissions: [
    'cookies',
    'storage',
    'sidePanel',
  ],
  host_permissions: ['<all_urls>'],
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
});
