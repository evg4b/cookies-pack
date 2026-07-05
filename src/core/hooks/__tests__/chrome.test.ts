import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { useCookies as UseCookiesFn } from '../chrome';

type Cookie = chrome.cookies.Cookie;
type TabUpdatedListener = (tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo) => void | Promise<void>;

const mockCookie = (overrides?: Partial<Cookie>): Cookie => ({
  name: 'test_cookie',
  value: 'test_value',
  domain: '.example.com',
  path: '/',
  secure: false,
  httpOnly: false,
  sameSite: 'lax',
  session: false,
  expirationDate: 1234567890,
  storeId: '0',
  hostOnly: false,
  ...overrides,
});

const createMockChrome = () => {
  const cookiesChangedListeners: Array<() => void | Promise<void>> = [];
  const tabActivatedListeners: Array<() => void | Promise<void>> = [];
  const tabUpdatedListeners: TabUpdatedListener[] = [];

  const api = {
    tabs: {
      query: vi.fn(),
      onActivated: {
        addListener: (cb: () => void | Promise<void>) => tabActivatedListeners.push(cb),
      },
      onUpdated: {
        addListener: (cb: TabUpdatedListener) => tabUpdatedListeners.push(cb),
      },
    },
    cookies: {
      getAll: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      onChanged: {
        addListener: (cb: () => void | Promise<void>) => cookiesChangedListeners.push(cb),
      },
    },
  };

  return {
    api,
    emitCookiesChanged: async () => {
      await Promise.all(cookiesChangedListeners.map((l) => l()));
    },
    emitTabActivated: async () => {
      await Promise.all(tabActivatedListeners.map((l) => l()));
    },
    emitTabUpdated: async (tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo) => {
      await Promise.all(tabUpdatedListeners.map((l) => l(tabId, changeInfo)));
    },
  };
};

const ACTIVE_TAB_URL = 'https://example.com/page';

const withActiveTab = (mockChrome: ReturnType<typeof createMockChrome>, url: string | null = ACTIVE_TAB_URL) => {
  mockChrome.api.tabs.query.mockResolvedValue(url ? [{ url }] : []);
};

const loadHookModule = async (): Promise<{ useCookies: typeof UseCookiesFn }> => {
  vi.resetModules();
  return import('../chrome');
};

describe('useCookies', () => {
  let mockChrome: ReturnType<typeof createMockChrome>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockChrome = createMockChrome();
    vi.stubGlobal('chrome', mockChrome.api);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
  });

  describe('initial load', () => {
    it('loads cookies for the active tab on mount', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockResolvedValue([mockCookie(), mockCookie({ name: 'second' })]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.cookies).toHaveLength(2);
      expect(result.current.error).toBeNull();
      expect(mockChrome.api.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true });
      expect(mockChrome.api.cookies.getAll).toHaveBeenCalledWith({ url: ACTIVE_TAB_URL });
    });

    it('resolves to an empty list when there is no active tab URL', async () => {
      withActiveTab(mockChrome, null);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.cookies).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(mockChrome.api.cookies.getAll).not.toHaveBeenCalled();
    });

    it('captures an error when reading cookies fails', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockRejectedValue(new Error('Permission denied'));

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.cookies).toEqual([]);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Permission denied');
    });
  });

  describe('setCookie', () => {
    it('sets a cookie against the active tab URL and reloads state', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockCookie({ name: 'session', value: 'abc123' })]);
      mockChrome.api.cookies.set.mockResolvedValue(mockCookie({ name: 'session', value: 'abc123' }));

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());

      await waitFor(() => expect(result.current.loading).toBe(false));

      let created: Cookie | null | undefined;
      await act(async () => {
        created = await result.current.setCookie('session', 'abc123');
      });

      expect(mockChrome.api.cookies.set).toHaveBeenCalledWith({
        url: ACTIVE_TAB_URL,
        name: 'session',
        value: 'abc123',
      });
      expect(created).not.toBeNull();
      expect(created?.name).toBe('session');
      expect(result.current.cookies).toHaveLength(1);
    });

    it('passes through extra cookie details', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockResolvedValue([]);
      mockChrome.api.cookies.set.mockResolvedValue(undefined);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.setCookie('theme', 'dark', { secure: true, path: '/app' });
      });

      expect(mockChrome.api.cookies.set).toHaveBeenCalledWith({
        secure: true,
        path: '/app',
        url: ACTIVE_TAB_URL,
        name: 'theme',
        value: 'dark',
      });
    });

    it('fails gracefully when there is no URL to target', async () => {
      withActiveTab(mockChrome, null);
      mockChrome.api.cookies.getAll.mockResolvedValue([]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let created: Cookie | null | undefined;
      await act(async () => {
        created = await result.current.setCookie('session', 'abc123');
      });

      expect(created).toBeNull();
      expect(mockChrome.api.cookies.set).not.toHaveBeenCalled();
      await waitFor(() => expect(result.current.error).not.toBeNull());
      expect(result.current.error?.message).toBe('Cannot set cookie without a valid URL');
    });

    it('captures errors thrown by the Chrome API', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockResolvedValue([]);
      mockChrome.api.cookies.set.mockRejectedValue(new Error('Chrome API error'));

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let created: Cookie | null | undefined;
      await act(async () => {
        created = await result.current.setCookie('session', 'abc123');
      });

      expect(created).toBeNull();
      expect(result.current.error?.message).toBe('Chrome API error');
    });
  });

  describe('removeCookie', () => {
    it('removes a cookie from the active tab and reloads state', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll
        .mockResolvedValueOnce([mockCookie({ name: 'session' })])
        .mockResolvedValueOnce([]);
      mockChrome.api.cookies.remove.mockResolvedValue(undefined);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.cookies).toHaveLength(1));

      await act(async () => {
        await result.current.removeCookie('session');
      });

      expect(mockChrome.api.cookies.remove).toHaveBeenCalledWith({ url: ACTIVE_TAB_URL, name: 'session' });
      expect(result.current.cookies).toEqual([]);
    });

    it('removes a cookie from an explicit URL', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockResolvedValue([]);
      mockChrome.api.cookies.remove.mockResolvedValue(undefined);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.removeCookie('session', 'https://other.com');
      });

      expect(mockChrome.api.cookies.remove).toHaveBeenCalledWith({ url: 'https://other.com', name: 'session' });
    });

    it('fails gracefully when there is no URL to target', async () => {
      withActiveTab(mockChrome, null);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.removeCookie('session');
      });

      expect(mockChrome.api.cookies.remove).not.toHaveBeenCalled();
      expect(result.current.error?.message).toBe('Cannot remove cookie without a valid URL');
    });
  });

  describe('removeAllCookies', () => {
    it('removes every cookie for the active tab and clears state', async () => {
      withActiveTab(mockChrome);
      const cookies = [mockCookie({ name: 'a' }), mockCookie({ name: 'b' }), mockCookie({ name: 'c' })];
      mockChrome.api.cookies.getAll.mockResolvedValue(cookies);
      mockChrome.api.cookies.remove.mockResolvedValue(undefined);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.cookies).toHaveLength(3));

      await act(async () => {
        await result.current.removeAllCookies();
      });

      expect(mockChrome.api.cookies.remove).toHaveBeenCalledTimes(3);
      expect(mockChrome.api.cookies.remove).toHaveBeenCalledWith({ url: ACTIVE_TAB_URL, name: 'a' });
      expect(mockChrome.api.cookies.remove).toHaveBeenCalledWith({ url: ACTIVE_TAB_URL, name: 'b' });
      expect(mockChrome.api.cookies.remove).toHaveBeenCalledWith({ url: ACTIVE_TAB_URL, name: 'c' });
      expect(result.current.cookies).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('is a no-op when there are no cookies', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockResolvedValue([]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.removeAllCookies();
      });

      expect(mockChrome.api.cookies.remove).not.toHaveBeenCalled();
    });

    it('fails gracefully when there is no URL to target', async () => {
      withActiveTab(mockChrome, null);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.removeAllCookies();
      });

      expect(result.current.error?.message).toBe('Cannot remove cookies without a valid URL');
    });
  });

  describe('getCookie', () => {
    it('returns a cookie by name from current state', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockResolvedValue([mockCookie({ name: 'session' })]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.cookies).toHaveLength(1));

      expect(result.current.getCookie('session')?.name).toBe('session');
      expect(result.current.getCookie('missing')).toBeUndefined();
    });
  });

  describe('refresh', () => {
    it('reloads cookies on demand', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockCookie({ name: 'new' })]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.cookies).toEqual([]);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.cookies).toHaveLength(1);
      expect(mockChrome.api.cookies.getAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('chrome event subscriptions', () => {
    it('reloads cookies when chrome.cookies.onChanged fires', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockCookie({ name: 'updated' })]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await mockChrome.emitCookiesChanged();
      });

      expect(result.current.cookies).toHaveLength(1);
      expect(result.current.cookies[0].name).toBe('updated');
    });

    it('reloads cookies when the active tab changes', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockCookie({ name: 'other-tab' })]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await mockChrome.emitTabActivated();
      });

      expect(result.current.cookies).toHaveLength(1);
    });

    it('reloads cookies only when a tab update includes a URL change', async () => {
      withActiveTab(mockChrome);
      mockChrome.api.cookies.getAll.mockResolvedValue([]);

      const { useCookies } = await loadHookModule();
      const { result } = renderHook(() => useCookies());
      await waitFor(() => expect(result.current.loading).toBe(false));

      const callsBeforeUpdate = mockChrome.api.cookies.getAll.mock.calls.length;

      await act(async () => {
        await mockChrome.emitTabUpdated(1, {});
      });
      expect(mockChrome.api.cookies.getAll).toHaveBeenCalledTimes(callsBeforeUpdate);

      await act(async () => {
        await mockChrome.emitTabUpdated(1, { url: 'https://new-url.com' });
      });
      expect(mockChrome.api.cookies.getAll).toHaveBeenCalledTimes(callsBeforeUpdate + 1);
    });
  });
});
