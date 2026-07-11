import { describe, it, expect } from 'vitest';
import { isSupportedUrl } from '../isSupportedUrl';

describe('isSupportedUrl', () => {
  it('returns false for null or undefined', () => {
    expect(isSupportedUrl(null)).toBe(false);
    expect(isSupportedUrl(undefined)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isSupportedUrl('')).toBe(false);
  });

  it('returns true for http and https pages', () => {
    expect(isSupportedUrl('http://example.com')).toBe(true);
    expect(isSupportedUrl('https://example.com/path')).toBe(true);
  });

  it('returns false for internal browser pages', () => {
    expect(isSupportedUrl('chrome://extensions')).toBe(false);
    expect(isSupportedUrl('chrome://newtab')).toBe(false);
    expect(isSupportedUrl('edge://settings')).toBe(false);
    expect(isSupportedUrl('about:blank')).toBe(false);
    expect(isSupportedUrl('chrome-extension://abcdefg/options.html')).toBe(false);
    expect(isSupportedUrl('devtools://devtools/bundled/inspector.html')).toBe(false);
    expect(isSupportedUrl('view-source:https://example.com')).toBe(false);
  });

  it('returns false for an unparsable url', () => {
    expect(isSupportedUrl('not a url')).toBe(false);
  });
});
