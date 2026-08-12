import { describe, it, expect } from 'vitest';
import { isSupportedUrl } from '../isSupportedUrl';

describe('isSupportedUrl', () => {
  it('returns false for null or undefined', () => {
    expect(isSupportedUrl(null)).toBe(false);
    expect(isSupportedUrl(undefined)).toBe(false);
  });

  it('returns true for http and https pages', () => {
    expect(isSupportedUrl(new URL('http://example.com'))).toBe(true);
    expect(isSupportedUrl(new URL('https://example.com/path'))).toBe(true);
  });

  it('returns false for internal browser pages', () => {
    expect(isSupportedUrl(new URL('chrome://extensions'))).toBe(false);
    expect(isSupportedUrl(new URL('chrome://newtab'))).toBe(false);
    expect(isSupportedUrl(new URL('edge://settings'))).toBe(false);
    expect(isSupportedUrl(new URL('about:blank'))).toBe(false);
    expect(isSupportedUrl(new URL('chrome-extension://abcdefg/options.html'))).toBe(false);
    expect(isSupportedUrl(new URL('devtools://devtools/bundled/inspector.html'))).toBe(false);
    expect(isSupportedUrl(new URL('view-source:https://example.com'))).toBe(false);
  });
});
