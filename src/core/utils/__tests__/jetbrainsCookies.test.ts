import { describe, it, expect } from 'vitest';
import { encodeJetbrainsCookies } from '../jetbrainsCookies';

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

describe('encodeJetbrainsCookies', () => {
  it('emits only the header row for an empty list', () => {
    expect(encodeJetbrainsCookies([])).toBe('# domain\tpath\tname\tvalue\tdate');
  });

  it('encodes a cookie without an expiration date as "-1"', () => {
    const output = encodeJetbrainsCookies([mockCookie({ expirationDate: undefined })]);
    const [, row] = output.split('\n');

    expect(row).toBe('.example.com\t/\ttest_cookie\ttest_value\t-1');
  });

  it('formats the expiration date as "eee, dd-MMM-yyyy HH:mm:ss"', () => {
    const date = new Date(2024, 0, 3, 4, 5, 6);
    const output = encodeJetbrainsCookies([mockCookie({ expirationDate: date.getTime() / 1000 })]);
    const [, row] = output.split('\n');
    const [, , , , formattedDate] = row.split('\t');

    expect(formattedDate).toBe('Wed, 03-Jan-2024 04:05:06');
  });

  it('encodes multiple cookies as tab-separated rows joined by newlines', () => {
    const cookies = [
      mockCookie({ name: 'a', domain: 'a.com', path: '/a', value: '1', expirationDate: undefined }),
      mockCookie({ name: 'b', domain: 'b.com', path: '/b', value: '2', expirationDate: undefined }),
    ];

    expect(encodeJetbrainsCookies(cookies)).toBe(
      ['# domain\tpath\tname\tvalue\tdate', 'a.com\t/a\ta\t1\t-1', 'b.com\t/b\tb\t2\t-1'].join('\n'),
    );
  });
});
