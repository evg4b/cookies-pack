import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { CookiesTable } from '../CookiesTable/CookiesTable.tsx';

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
const onAddCookie = vi.fn();
const onEditCookie = vi.fn();
const setCookieEditorEnabled = vi.fn();
let cookies: Cookie[] = [];
let cookieEditorEnabled = true;

vi.mock('@core/hooks', () => ({
  useCookies: () => ({ cookies, removeCookie }),
  useSaveFile: () => ({ saveFile }),
  useCookieEditorEnabled: () => [cookieEditorEnabled, setCookieEditorEnabled],
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
}));

vi.mock('@mantine/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@mantine/hooks')>()),
  useClipboard: () => ({ copied: false, copy, reset: vi.fn(), error: null }),
}));

describe('CookiesTable', () => {
  beforeEach(() => {
    cookies = [];
    cookieEditorEnabled = true;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the empty state when there are no cookies', () => {
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    expect(screen.getByText('cookies_table_empty_title')).toBeInTheDocument();
    expect(screen.getByText('cookies_table_empty_description')).toBeInTheDocument();
  });

  it('calls onAddCookie from the empty state when the add-cookie action is clicked', () => {
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_add_cookie'));

    expect(onAddCookie).toHaveBeenCalled();
  });

  it('renders a row for each cookie', () => {
    cookies = [
      mockCookie({ name: 'a', path: '/a', value: '1' }),
      mockCookie({ name: 'b', path: '/b', value: '2' }),
    ];

    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('/a')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });

  it('copies the cookie value to the clipboard when the value cell is clicked', () => {
    cookies = [mockCookie({ name: 'session', value: 'abc123' })];
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByText('abc123'));

    expect(copy).toHaveBeenCalledWith('abc123');
  });

  it('calls removeCookie with the row cookie name when the delete action is clicked', () => {
    cookies = [mockCookie({ name: 'session' })];
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_delete_cookie'));

    expect(removeCookie).toHaveBeenCalledWith('session');
  });

  it('calls onEditCookie with the row cookie when the edit action is clicked', () => {
    const cookie = mockCookie({ name: 'session' });
    cookies = [cookie];
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_edit_cookie'));

    expect(onEditCookie).toHaveBeenCalledWith(cookie);
  });

  it('copies all cookies as a header string when the copy-all action is clicked', () => {
    cookies = [mockCookie({ name: 'a', value: '1' }), mockCookie({ name: 'b', value: '2' })];
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_copy_all_cookies'));

    expect(copy).toHaveBeenCalledWith('a=1;\nb=2');
  });

  it('exports all cookies as a Jetbrains-formatted file when the export action is clicked', () => {
    cookies = [mockCookie({ name: 'a', value: '1', domain: 'x.com', path: '/', expirationDate: undefined })];
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByLabelText('cookies_table_export_all_cookies'));

    expect(saveFile).toHaveBeenCalledWith(
      expect.stringContaining('x.com\t/\ta\t1\t-1'),
      expect.objectContaining({ suggestedName: 'cookies_table_export_filename' }),
    );
  });

  it('hides the add-cookie action from the empty state when the cookie editor is disabled', () => {
    cookieEditorEnabled = false;
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    expect(screen.queryByLabelText('cookies_table_add_cookie')).not.toBeInTheDocument();
  });

  it('hides the add-cookie and edit-cookie actions when the cookie editor is disabled', () => {
    cookieEditorEnabled = false;
    cookies = [mockCookie({ name: 'session' })];
    render(<CookiesTable onAddCookie={onAddCookie} onEditCookie={onEditCookie}/>, { wrapper: MantineProvider });

    expect(screen.queryByLabelText('cookies_table_add_cookie')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('cookies_table_edit_cookie')).not.toBeInTheDocument();
    expect(screen.getByLabelText('cookies_table_delete_cookie')).toBeInTheDocument();
  });
});
