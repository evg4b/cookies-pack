import { describe, expect, it } from 'vitest';
import { isSupportedUrl } from '@core/utils';

describe('isSupportedUrl', () => {
  it('returns false for null', () => {
    expect(isSupportedUrl(null))
      .toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isSupportedUrl(undefined))
      .toBe(false);
  });

  const supportedUrls = [
    'https://www.google.com',
    'http://www.example.com/path?query=value',
  ];

  it.each(supportedUrls)('returns true for %s', (url) => {
    expect(isSupportedUrl(new URL(url))).toBe(true);
  });

  const unsupportedUrls = [
    'chrome://extensions',
    'chrome://newtab',
    'edge://settings',
    'about:blank',
    'chrome-extension://abcdefg/options.html',
    'devtools://devtools/bundled/inspector.html',
    'view-source:https://example.com',
  ];

  it.each(unsupportedUrls)('returns false for %s', (url) => {
    expect(isSupportedUrl(new URL(url))).toBe(false);
  });
});

