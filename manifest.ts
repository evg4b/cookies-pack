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
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuoZ6iyeKFISXJhEau79T' +
    'Qd/aBiTsPO6RTt6ZAy2lm1px8pDK7PZKBNA5B8CrSa67OJyZvm8HDTVGc4xxXQ41' +
    'chG0e8ONxYi3k3QRio4u1m3H3S/5xJZtvgEgSbqOLQutdOrYLW9R3ile+AhIQZhR' +
    'rNL2ni76GOFithkYPdwpn13xj3p7jFVdkYRDyQl25uzCy2dBUk6i9FzgCT/tCvaC' +
    'cK+TqQkdk0xjeYiGKN/9uucBCew98zE93mEESFOtAOzs6KjYkzo+L7rTlfSeKL/k' +
    'uErnQ9r/TLZ6HLvj5ZICMmYFEm1hi7bMAUbxp9Fwq1Zew+Ozqrj3Svi4l/Iypa2F' +
    'vQIDAQAB',
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
