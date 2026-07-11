import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { CookiesTable } from '../CookiesTable';

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

const removeCookie = vi.fn();
const copy = vi.fn();
const saveFile = vi.fn();
let cookies: Cookie[] = [];

vi.mock('@core/hooks', () => ({
  useCookies: () => ({ cookies, removeCookie }),
  useCopyToClipboard: () => ({ copied: false, copy }),
  useSaveFile: () => ({ saveFile }),
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
}));

describe('CookiesTable', () => {
  beforeEach(() => {
    cookies = [];
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the empty state when there are no cookies', () => {
    render(<CookiesTable/>, { wrapper: MantineProvider });

    expect(screen.getByText('cookies_table_empty_title')).toBeInTheDocument();
    expect(screen.getByText('cookies_table_empty_description')).toBeInTheDocument();
  });

  it('renders a row for each cookie', () => {
    cookies = [
      mockCookie({ name: 'a', path: '/a', value: '1' }),
      mockCookie({ name: 'b', path: '/b', value: '2' }),
    ];

    render(<CookiesTable/>, { wrapper: MantineProvider });

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('/a')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });

  it('copies the cookie value to the clipboard when the value cell is clicked', () => {
    cookies = [mockCookie({ name: 'session', value: 'abc123' })];
    render(<CookiesTable/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByText('abc123'));

    expect(copy).toHaveBeenCalledWith('abc123');
  });

  it('calls removeCookie with the row cookie name when the delete action is clicked', () => {
    cookies = [mockCookie({ name: 'session' })];
    render(<CookiesTable/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_delete_cookie'));

    expect(removeCookie).toHaveBeenCalledWith('session');
  });

  it('copies all cookies as a header string when the copy-all action is clicked', () => {
    cookies = [mockCookie({ name: 'a', value: '1' }), mockCookie({ name: 'b', value: '2' })];
    render(<CookiesTable/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_copy_all_cookies'));

    expect(copy).toHaveBeenCalledWith('a=1;\nb=2');
  });

  it('exports all cookies as a Jetbrains-formatted file when the export action is clicked', () => {
    cookies = [mockCookie({ name: 'a', value: '1', domain: 'x.com', path: '/', expirationDate: undefined })];
    render(<CookiesTable/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_export_all_cookies'));

    expect(saveFile).toHaveBeenCalledWith(
      expect.stringContaining('x.com\t/\ta\t1\t-1'),
      expect.objectContaining({ suggestedName: 'cookies_table_export_filename' }),
    );
  });
});
