import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCookieEditorForm } from '../CookieEditor/useCookieEditorForm';

type Cookie = chrome.cookies.Cookie;

const setCookie = vi.fn().mockResolvedValue(null);
const removeCookie = vi.fn().mockResolvedValue(undefined);
const onClose = vi.fn();

const DEFAULT_TAB_URL = 'https://example.com/current/path';
let activeTabUrl: string | null = DEFAULT_TAB_URL;

vi.mock('@core/hooks', () => ({
  useTranslation: (namespace: string) => (key: string) => `${namespace}_${key}`,
  useActiveTab: () => ({ url: activeTabUrl, tab: null, loading: false, error: null, refresh: vi.fn() }),
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

describe('useCookieEditorForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
    activeTabUrl = DEFAULT_TAB_URL;
  });

  describe('add mode', () => {
    it('starts with an empty name and a session cookie by default', () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      expect(result.current.form.values.name).toBe('');
      expect(result.current.form.values.value).toBe('');
      expect(result.current.form.values.session).toBe(true);
    });

    it('prefills domain, path and secure from the active tab', () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      expect(result.current.form.values.domain).toBe('example.com');
      expect(result.current.form.values.path).toBe('/current/path');
      expect(result.current.form.values.secure).toBe(true);
    });

    it('does not re-prefill and clobber edits when the active tab URL changes later', () => {
      const { result, rerender } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.setFieldValue('domain', 'custom.com');
      });

      activeTabUrl = 'https://other.com/other-path';
      rerender();

      expect(result.current.form.values.domain).toBe('custom.com');
    });
  });

  describe('edit mode', () => {
    it('initializes values from the given cookie without prefilling from the tab', () => {
      const { result } = renderHook(() => useCookieEditorForm({ cookie: editedCookie, onClose }));

      expect(result.current.form.values).toMatchObject({
        name: 'existing',
        value: 'val',
        domain: 'example.com',
        path: '/old',
        secure: false,
        session: false,
      });
    });
  });

  describe('validation', () => {
    it('requires a name', () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.validate();
      });

      expect(result.current.form.errors.name).toBe('cookie_editor_error_required');
    });

    it('requires a path starting with /', () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.setFieldValue('path', 'no-leading-slash');
        result.current.form.validate();
      });

      expect(result.current.form.errors.path).toBe('cookie_editor_error_path');
    });

    it('requires an expiration date unless session is enabled', () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.setFieldValue('session', false);
        result.current.form.setFieldValue('expirationDate', null);
        result.current.form.validate();
      });

      expect(result.current.form.errors.expirationDate).toBe('cookie_editor_error_required');
    });

    it('rejects a domain that is not the tab domain or a parent of it', () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.setFieldValue('domain', 'other.com');
        result.current.form.validate();
      });

      expect(result.current.form.errors.domain).toBe('cookie_editor_error_domain_mismatch');
    });

    it('accepts a domain that is a parent of the tab domain', () => {
      activeTabUrl = 'https://sub.example.com/path';
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.setFieldValue('domain', 'example.com');
        result.current.form.validate();
      });

      expect(result.current.form.errors.domain).toBeUndefined();
    });

    it('ignores a www prefix on either side when validating the domain', () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.setFieldValue('domain', 'www.example.com');
        result.current.form.validate();
      });

      expect(result.current.form.errors.domain).toBeUndefined();
    });
  });

  describe('submit', () => {
    it('creates a new cookie with the entered details and closes the editor', async () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));

      act(() => {
        result.current.form.setFieldValue('name', 'my_cookie');
        result.current.form.setFieldValue('value', 'my_value');
      });

      act(() => {
        result.current.submit(result.current.form.getValues());
      });

      await waitFor(() => {
        expect(setCookie).toHaveBeenCalledWith('my_cookie', 'my_value', expect.objectContaining({
          url: 'https://example.com/current/path',
          domain: 'example.com',
          path: '/current/path',
          secure: true,
          expirationDate: undefined,
        }));
      });
      expect(onClose).toHaveBeenCalled();
    });

    it('sends expirationDate as a unix timestamp when session is disabled', async () => {
      const { result } = renderHook(() => useCookieEditorForm({ onClose }));
      const expirationDate = new Date('2030-01-01T00:00:00.000Z');

      act(() => {
        result.current.form.setFieldValue('name', 'my_cookie');
        result.current.form.setFieldValue('session', false);
        result.current.form.setFieldValue('expirationDate', expirationDate);
      });

      act(() => {
        result.current.submit(result.current.form.getValues());
      });

      await waitFor(() => {
        expect(setCookie).toHaveBeenCalledWith('my_cookie', '', expect.objectContaining({
          expirationDate: Math.floor(expirationDate.getTime() / 1000),
        }));
      });
    });

    it('removes the original cookie before setting the updated one when identity fields change', async () => {
      const { result } = renderHook(() => useCookieEditorForm({ cookie: editedCookie, onClose }));

      act(() => {
        result.current.form.setFieldValue('path', '/new');
      });

      act(() => {
        result.current.submit(result.current.form.getValues());
      });

      await waitFor(() => {
        expect(removeCookie).toHaveBeenCalledWith('existing', 'http://example.com/old');
      });
      expect(setCookie).toHaveBeenCalledWith('existing', 'val', expect.objectContaining({ path: '/new' }));
    });

    it('does not remove the original cookie when identity fields are unchanged', async () => {
      const { result } = renderHook(() => useCookieEditorForm({ cookie: editedCookie, onClose }));

      act(() => {
        result.current.form.setFieldValue('value', 'new_val');
      });

      act(() => {
        result.current.submit(result.current.form.getValues());
      });

      await waitFor(() => {
        expect(setCookie).toHaveBeenCalledWith('existing', 'new_val', expect.anything());
      });
      expect(removeCookie).not.toHaveBeenCalled();
    });
  });
});
