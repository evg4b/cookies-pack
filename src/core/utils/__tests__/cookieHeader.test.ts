import { describe, it, expect } from 'vitest';
import { parseCookieHeader, joinCookiesHeader } from '../cookieHeader';

type Cookie = chrome.cookies.Cookie;

const mockCookie = (overrides?: Partial<Cookie>): Cookie => ({
  name: 'test_cookie',
  value: 'test_value',
  domain: '.example.com',
  path: '/',
  secure: false,
  httpOnly: false,
  sameSite: 'lax',
  session: false,
  storeId: '0',
  hostOnly: false,
  ...overrides,
});

describe('parseCookieHeader', () => {
  it('returns an empty array for a null or undefined header', () => {
    expect(parseCookieHeader(null, 'https://example.com', '/')).toEqual([]);
    expect(parseCookieHeader(undefined, 'https://example.com', '/')).toEqual([]);
  });

  it('returns an empty array for an empty header', () => {
    expect(parseCookieHeader('', 'https://example.com', '/')).toEqual([]);
  });

  it('parses a single name=value pair', () => {
    expect(parseCookieHeader('foo=bar', 'https://example.com', '/')).toEqual([
      { url: 'https://example.com', path: '/', name: 'foo', value: 'bar' },
    ]);
  });

  it('parses multiple semicolon-separated pairs', () => {
    expect(parseCookieHeader('foo=bar; bat=baz; oof=rab', 'https://example.com', '/app')).toEqual([
      { url: 'https://example.com', path: '/app', name: 'foo', value: 'bar' },
      { url: 'https://example.com', path: '/app', name: 'bat', value: 'baz' },
      { url: 'https://example.com', path: '/app', name: 'oof', value: 'rab' },
    ]);
  });

  it('parses pairs separated by newlines', () => {
    expect(parseCookieHeader('foo=bar;\nbat=baz', 'https://example.com', '/')).toEqual([
      { url: 'https://example.com', path: '/', name: 'foo', value: 'bar' },
      { url: 'https://example.com', path: '/', name: 'bat', value: 'baz' },
    ]);
  });

  it('treats an entry with no "=" as a name with an empty value', () => {
    expect(parseCookieHeader('justname', 'https://example.com', '/')).toEqual([
      { url: 'https://example.com', path: '/', name: 'justname', value: '' },
    ]);
  });

  it('filters out blank entries', () => {
    expect(parseCookieHeader('foo=bar;; bat=baz', 'https://example.com', '/')).toEqual([
      { url: 'https://example.com', path: '/', name: 'foo', value: 'bar' },
      { url: 'https://example.com', path: '/', name: 'bat', value: 'baz' },
    ]);
  });
});

describe('joinCookiesHeader', () => {
  it('returns an empty string for no cookies', () => {
    expect(joinCookiesHeader([])).toBe('');
  });

  it('joins a single cookie as name=value', () => {
    expect(joinCookiesHeader([mockCookie({ name: 'foo', value: 'bar' })])).toBe('foo=bar');
  });

  it('joins multiple cookies with ";\\n"', () => {
    const cookies = [mockCookie({ name: 'foo', value: 'bar' }), mockCookie({ name: 'bat', value: 'baz' })];
    expect(joinCookiesHeader(cookies)).toBe('foo=bar;\nbat=baz');
  });

  it('URL-encodes cookie values', () => {
    expect(joinCookiesHeader([mockCookie({ name: 'foo', value: 'a b;c' })])).toBe('foo=a%20b%3Bc');
  });

  it('round-trips through parseCookieHeader after decoding', () => {
    const cookies = [mockCookie({ name: 'foo', value: 'a b;c' })];
    const header = joinCookiesHeader(cookies);
    const parsed = parseCookieHeader(header, 'https://example.com', '/');

    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('foo');
    expect(decodeURIComponent(parsed[0].value ?? '')).toBe('a b;c');
  });
});
