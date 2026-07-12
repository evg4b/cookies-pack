import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { CookieEditor } from '../CookieEditor';

type Cookie = chrome.cookies.Cookie;

const setCookie = vi.fn().mockResolvedValue(null);
const removeCookie = vi.fn().mockResolvedValue(undefined);
const query = vi.fn().mockResolvedValue([{ url: 'https://example.com/current/path' }]);
const onClose = vi.fn();

vi.mock('@core/hooks', () => ({
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
  useTabs: () => ({ query }),
  useCookies: () => ({ setCookie, removeCookie }),
}));

const editedCookie: Cookie = {
  name: 'existing',
  value: 'val',
  domain: 'example.com',
  path: '/old',
  secure: false,
  httpOnly: false,
  sameSite: 'lax',
  session: false,
  expirationDate: 1700000000,
  storeId: '0',
  hostOnly: false,
};

describe('CookieEditor', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('pre-fills domain, path and secure from the active tab when adding a cookie', async () => {
    render(<CookieEditor onClose={onClose}/>, { wrapper: MantineProvider });

    expect(screen.getByText('cookie_editor_title_add')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/current/path')).toBeInTheDocument();
  });

  it('creates a new cookie with the entered details', async () => {
    render(<CookieEditor onClose={onClose}/>, { wrapper: MantineProvider });
    await screen.findByDisplayValue('example.com');

    fireEvent.change(screen.getByLabelText(/^cookie_editor_name_label/), { target: { value: 'my_cookie' } });
    fireEvent.change(screen.getByLabelText('cookie_editor_value_label'), { target: { value: 'my_value' } });

    fireEvent.click(screen.getByRole('button', { name: 'cookie_editor_save' }));

    await waitFor(() => {
      expect(setCookie).toHaveBeenCalledWith('my_cookie', 'my_value', expect.objectContaining({
        url: 'https://example.com/current/path',
        domain: 'example.com',
        path: '/current/path',
        secure: true,
        sameSite: 'lax',
        httpOnly: false,
        expirationDate: undefined,
      }));
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('shows a validation error and does not submit when the name is empty', async () => {
    render(<CookieEditor onClose={onClose}/>, { wrapper: MantineProvider });
    await screen.findByDisplayValue('example.com');

    fireEvent.click(screen.getByRole('button', { name: 'cookie_editor_save' }));

    expect(await screen.findAllByText('cookie_editor_error_required')).not.toHaveLength(0);
    expect(setCookie).not.toHaveBeenCalled();
  });

  it('disables the expiration field while session is enabled, and enables it otherwise', async () => {
    render(<CookieEditor onClose={onClose}/>, { wrapper: MantineProvider });
    await screen.findByDisplayValue('example.com');

    expect(screen.getByLabelText('cookie_editor_expiration_label')).toBeDisabled();

    fireEvent.click(screen.getByLabelText('cookie_editor_session_label'));

    expect(screen.getByLabelText(/^cookie_editor_expiration_label/)).toBeEnabled();
  });

  it('calls onClose when the back action is clicked', async () => {
    render(<CookieEditor onClose={onClose}/>, { wrapper: MantineProvider });
    await screen.findByDisplayValue('example.com');

    fireEvent.click(screen.getByLabelText('cookie_editor_back'));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when the cancel button is clicked', async () => {
    render(<CookieEditor onClose={onClose}/>, { wrapper: MantineProvider });
    await screen.findByDisplayValue('example.com');

    fireEvent.click(screen.getByRole('button', { name: 'cookie_editor_cancel' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('pre-fills the form with the cookie being edited', () => {
    render(<CookieEditor cookie={editedCookie} onClose={onClose}/>, { wrapper: MantineProvider });

    expect(screen.getByText('cookie_editor_title_edit')).toBeInTheDocument();
    expect(screen.getByDisplayValue('existing')).toBeInTheDocument();
    expect(screen.getByDisplayValue('val')).toBeInTheDocument();
    expect(screen.getByDisplayValue('example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/old')).toBeInTheDocument();
  });

  it('removes the original cookie before setting the updated one when identity fields change', async () => {
    render(<CookieEditor cookie={editedCookie} onClose={onClose}/>, { wrapper: MantineProvider });

    fireEvent.change(screen.getByLabelText(/^cookie_editor_path_label/), { target: { value: '/new' } });
    fireEvent.click(screen.getByRole('button', { name: 'cookie_editor_save' }));

    await waitFor(() => {
      expect(removeCookie).toHaveBeenCalledWith('existing', 'http://example.com/old');
    });
    expect(setCookie).toHaveBeenCalledWith('existing', 'val', expect.objectContaining({ path: '/new' }));
  });

  it('does not remove the original cookie when identity fields are unchanged', async () => {
    render(<CookieEditor cookie={editedCookie} onClose={onClose}/>, { wrapper: MantineProvider });

    fireEvent.change(screen.getByLabelText('cookie_editor_value_label'), { target: { value: 'new_val' } });
    fireEvent.click(screen.getByRole('button', { name: 'cookie_editor_save' }));

    await waitFor(() => {
      expect(setCookie).toHaveBeenCalledWith('existing', 'new_val', expect.anything());
    });
    expect(removeCookie).not.toHaveBeenCalled();
  });
});
