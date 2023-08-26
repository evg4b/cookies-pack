import type { Manifest } from 'webextension-polyfill';
import pkg from '../package.json';

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: 'src/options/index.html',
  },
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: 'icon-34.png',
    default_title: pkg.displayName,
  },
  icons: {
    128: 'icon-128.png',
    512: 'icon-512.png',
  },
  permissions: ['cookies'],
  host_permissions: ['<all_urls>'],
};

export default manifest;
