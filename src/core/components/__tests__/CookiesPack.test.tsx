import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { CookiesPack } from '../CookiesPack';

type Cookie = chrome.cookies.Cookie;

const mockCookie: Cookie = {
  name: 'session',
  value: 'abc123',
  domain: 'example.com',
  path: '/',
  secure: false,
  httpOnly: false,
  sameSite: 'lax',
  session: true,
  storeId: '0',
  hostOnly: false,
};

let bulkEditorEnabled = true;

vi.mock('@core/hooks', () => ({
  useCookieEditors: () => ({ bulkEditorEnabled, editorEnabled: true }),
}));

vi.mock('@core/components', () => ({
  CookiesTable: ({ onAddCookie, onEditCookie }: {
    onAddCookie: () => void;
    onEditCookie: (cookie: Cookie) => void;
  }) => (
    <div data-testid="cookies-table">
      <button onClick={onAddCookie}>add-cookie</button>
      <button onClick={() => onEditCookie(mockCookie)}>edit-cookie</button>
    </div>
  ),
  CookiesBatchUpdate: () => <div data-testid="cookies-batch-update"/>,
  CookieEditor: ({ cookie, onClose }: { cookie?: Cookie; onClose: () => void }) => (
    <div data-testid="cookie-editor">
      <span>{cookie ? `editing:${cookie.name}` : 'adding'}</span>
      <button onClick={onClose}>close</button>
    </div>
  ),
  SupportingWrapper: ({ children }: PropsWithChildren) => children,
}));

describe('CookiesPack', () => {
  beforeEach(() => {
    bulkEditorEnabled = true;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the table and the bulk editor by default', () => {
    render(<CookiesPack/>, { wrapper: MantineProvider });

    expect(screen.getByTestId('cookies-table')).toBeInTheDocument();
    expect(screen.getByTestId('cookies-batch-update')).toBeInTheDocument();
  });

  it('hides the bulk editor when it is disabled', () => {
    bulkEditorEnabled = false;
    render(<CookiesPack/>, { wrapper: MantineProvider });

    expect(screen.getByTestId('cookies-table')).toBeInTheDocument();
    expect(screen.queryByTestId('cookies-batch-update')).not.toBeInTheDocument();
  });

  it('opens the editor in add mode and hides the table', () => {
    render(<CookiesPack/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByText('add-cookie'));

    expect(screen.getByTestId('cookie-editor')).toBeInTheDocument();
    expect(screen.getByText('adding')).toBeInTheDocument();
    expect(screen.queryByTestId('cookies-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cookies-batch-update')).not.toBeInTheDocument();
  });

  it('opens the editor in edit mode with the selected cookie', () => {
    render(<CookiesPack/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByText('edit-cookie'));

    expect(screen.getByText('editing:session')).toBeInTheDocument();
  });

  it('returns to the table when the editor is closed', () => {
    render(<CookiesPack/>, { wrapper: MantineProvider });

    fireEvent.click(screen.getByText('add-cookie'));
    expect(screen.getByTestId('cookie-editor')).toBeInTheDocument();

    fireEvent.click(screen.getByText('close'));

    expect(screen.getByTestId('cookies-table')).toBeInTheDocument();
    expect(screen.queryByTestId('cookie-editor')).not.toBeInTheDocument();
  });
});
