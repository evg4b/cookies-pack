import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { CookiesBatchUpdate } from '../CookiesBatchUpdate';

const setCookie = vi.fn().mockResolvedValue(null);
const removeAllCookies = vi.fn().mockResolvedValue(undefined);
const setClearFirst = vi.fn().mockResolvedValue(undefined);
const setCustomPath = vi.fn().mockResolvedValue(undefined);
const query = vi.fn().mockResolvedValue([{ url: 'https://example.com/current/path' }]);

let clearFirst = true;
let customPath = false;

vi.mock('@core/hooks', () => ({
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
  useTabs: () => ({ query }),
  useCookies: () => ({ setCookie, removeAllCookies }),
  useClearExistingCookiesFirst: () => [clearFirst, setClearFirst],
  useCustomPath: () => [customPath, setCustomPath],
}));

describe('CookiesBatchUpdate', () => {
  beforeEach(() => {
    clearFirst = true;
    customPath = false;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows the "replace" label when clear-first is enabled and "add" otherwise', async () => {
    clearFirst = true;
    const { rerender } = render(<CookiesBatchUpdate/>, { wrapper: MantineProvider });
    expect(await screen.findByText('cookies_batch_update_replace_cookies')).toBeInTheDocument();

    clearFirst = false;
    rerender(<CookiesBatchUpdate/>);
    expect(await screen.findByText('cookies_batch_update_add_cookies')).toBeInTheDocument();
  });

  it('disables the path input until custom path is enabled', async () => {
    customPath = false;
    render(<CookiesBatchUpdate/>, { wrapper: MantineProvider });

    expect(await screen.findByPlaceholderText('cookies_batch_update_path_placeholder')).toBeDisabled();
  });

  it('enables the path input when custom path is on', async () => {
    customPath = true;
    render(<CookiesBatchUpdate/>, { wrapper: MantineProvider });

    expect(await screen.findByPlaceholderText('cookies_batch_update_path_placeholder')).toBeEnabled();
  });

  it('toggles the custom-path setting when its switch is clicked', async () => {
    render(<CookiesBatchUpdate/>, { wrapper: MantineProvider });

    fireEvent.click(await screen.findByText('cookies_batch_update_path_label'));

    expect(setCustomPath).toHaveBeenCalledWith(true);
  });

  it('toggles the clear-first setting when its switch is clicked', async () => {
    render(<CookiesBatchUpdate/>, { wrapper: MantineProvider });

    fireEvent.click(await screen.findByText('cookies_batch_update_clear_first_label'));

    expect(setClearFirst).toHaveBeenCalledWith(false);
  });

  it('removes existing cookies then sets each parsed cookie and clears the textarea on submit', async () => {
    clearFirst = true;
    render(<CookiesBatchUpdate/>, { wrapper: MantineProvider });

    await waitFor(() => expect(query).toHaveBeenCalled());

    const textarea = screen.getByPlaceholderText('cookies_batch_update_placeholder');
    fireEvent.change(textarea, { target: { value: 'foo=bar; bat=baz' } });
    fireEvent.click(screen.getByText('cookies_batch_update_replace_cookies'));

    await waitFor(() => expect(setCookie).toHaveBeenCalledTimes(2));

    expect(removeAllCookies).toHaveBeenCalled();
    expect(setCookie).toHaveBeenCalledWith('foo', 'bar', { url: 'https://example.com/current/path', path: '/' });
    expect(setCookie).toHaveBeenCalledWith('bat', 'baz', { url: 'https://example.com/current/path', path: '/' });
    await waitFor(() => expect(textarea).toHaveValue(''));
  });

  it('does not remove existing cookies when clear-first is disabled', async () => {
    clearFirst = false;
    render(<CookiesBatchUpdate/>, { wrapper: MantineProvider });

    await waitFor(() => expect(query).toHaveBeenCalled());

    const textarea = screen.getByPlaceholderText('cookies_batch_update_placeholder');
    fireEvent.change(textarea, { target: { value: 'foo=bar' } });
    fireEvent.click(screen.getByText('cookies_batch_update_add_cookies'));

    await waitFor(() => expect(setCookie).toHaveBeenCalledTimes(1));

    expect(removeAllCookies).not.toHaveBeenCalled();
  });
});
