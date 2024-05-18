import { ManifestV3Export } from '@crxjs/vite-plugin';
import pkg from './package.json';

const debug = process.env.__DEV__ === 'true';

const image = (fileName: string) => {
  if (!debug) {
    return fileName;
  }

  const [name, ext] = fileName.split('.');

  return `${ name }.dev.${ ext }`;
};

export const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: debug ? `DEV: ${ pkg.displayName }` : pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  homepage_url: 'https://github.com/evg4b/cookies-pack',
  options_ui: {
    page: 'src/options/index.html',
  },
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: image('icon-34.png'),
    default_title: pkg.displayName,
  },
  icons: {
    128: image('icon-128.png'),
    512: image('icon-512.png'),
  },
  permissions: ['cookies'],
  host_permissions: ['<all_urls>'],
};
