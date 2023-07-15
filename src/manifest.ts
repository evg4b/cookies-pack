import type { Manifest } from 'webextension-polyfill';
import pkg from '../package.json';

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: 'src/pages/options/index.html',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
    // "default_icon": {
    //   "32": "icon.png",
    //   "16": "icon.png",
    //   "24": "icon.png",
    //   "128": "icon.png"
    // },
    "default_title": "Cookies Pack",
  },
  icons: {
    '128': 'icon-128.png',
  },
  // incognito: "split",
  permissions: ["cookies"],
  host_permissions: [
    "<all_urls>",
  ],
  devtools_page: 'src/pages/devtools/index.html',
};

export default manifest;
