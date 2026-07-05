import { createContext, useContext, useSyncExternalStore } from 'react';

type Cookie = chrome.cookies.Cookie;
type Listener = () => void;

interface CookiesState {
  cookies: Cookie[];
  loading: boolean;
  error: Error | null;
}

interface SetCookieDetails extends Omit<chrome.cookies.SetDetails, 'url'> {
  url?: string;
}

export const ChromeContext = createContext(chrome);

export const useTabs = () => {
  const chrome = useContext(ChromeContext);
  return chrome.tabs;
};

const createCookiesStore = () => {
  let state: CookiesState = {
    cookies: [],
    loading: true,
    error: null,
  };
  const listeners = new Set<Listener>();

  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (patch: Partial<CookiesState>) => {
    state = { ...state, ...patch };
    notifyListeners();
  };

  const getActiveTabUrl = async (): Promise<string | null> => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      return tabs[0]?.url ?? null;
    } catch (error) {
      console.error('Failed to get active tab URL:', error);
      return null;
    }
  };

  const loadCookies = async (): Promise<void> => {
    setState({ loading: true });
    try {
      const url = await getActiveTabUrl();
      const cookies = url ? await chrome.cookies.getAll({ url }) : [];
      setState({ cookies, error: null, loading: false });
    } catch (error) {
      console.error('Failed to load cookies:', error);
      setState({
        cookies: [],
        error: error instanceof Error ? error : new Error(String(error)),
        loading: false,
      });
    }
  };

  const handleCookiesChanged = async (): Promise<void> => {
    try {
      const url = await getActiveTabUrl();
      const cookies = url ? await chrome.cookies.getAll({ url }) : [];
      setState({ cookies, error: null });
    } catch (error) {
      console.error('Failed to handle cookie change:', error);
      setState({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  };

  const setCookie = async (name: string, value: string, details?: SetCookieDetails): Promise<Cookie | null> => {
    try {
      const url = details?.url ?? (await getActiveTabUrl());
      if (!url) throw new Error('Cannot set cookie without a valid URL');

      await chrome.cookies.set({
        ...details,
        url,
        name,
        value,
      });
      await loadCookies();
      return state.cookies.find((c) => c.name === name) ?? null;
    } catch (error) {
      console.error('Failed to set cookie:', error);
      setState({ error: error instanceof Error ? error : new Error(String(error)) });
      return null;
    }
  };

  const removeCookie = async (name: string, url?: string): Promise<void> => {
    try {
      const targetUrl = url ?? (await getActiveTabUrl());
      if (!targetUrl) throw new Error('Cannot remove cookie without a valid URL');

      await chrome.cookies.remove({ url: targetUrl, name });
      await loadCookies();
    } catch (error) {
      console.error('Failed to remove cookie:', error);
      setState({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  };

  const removeAllCookies = async (): Promise<void> => {
    try {
      const url = await getActiveTabUrl();
      if (!url) throw new Error('Cannot remove cookies without a valid URL');

      const cookiesToRemove = [...state.cookies];
      await Promise.all(cookiesToRemove.map((cookie) => chrome.cookies.remove({ url, name: cookie.name })));
      setState({ cookies: [], error: null });
    } catch (error) {
      console.error('Failed to remove all cookies:', error);
      setState({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  };

  const getCookie = (name: string): Cookie | undefined => {
    return state.cookies.find((c) => c.name === name);
  };

  const refresh = async (): Promise<void> => {
    await loadCookies();
  };

  chrome.cookies.onChanged.addListener(handleCookiesChanged);
  chrome.tabs.onActivated.addListener(refresh);
  chrome.tabs.onUpdated.addListener(async (_: number, changeInfo: chrome.tabs.OnUpdatedInfo): Promise<void> => {
    if (changeInfo.url) {
      await refresh();
    }
  });

  loadCookies().catch((error) => {
    console.error('Initial cookie load failed:', error);
  });

  return {
    getSnapshot: (): CookiesState => state,
    subscribe: (listener: Listener): (() => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setCookie,
    removeCookie,
    removeAllCookies,
    getCookie,
    refresh,
  };
};

const store = createCookiesStore();

export interface UseCookiesReturn extends CookiesState {
  setCookie: (name: string, value: string, details?: SetCookieDetails) => Promise<Cookie | null>;
  removeCookie: (name: string, url?: string) => Promise<void>;
  removeAllCookies: () => Promise<void>;
  getCookie: (name: string) => Cookie | undefined;
  refresh: () => Promise<void>;
}

export function useCookies(): UseCookiesReturn {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return {
    ...state,
    setCookie: store.setCookie,
    removeCookie: store.removeCookie,
    removeAllCookies: store.removeAllCookies,
    getCookie: store.getCookie,
    refresh: store.refresh,
  };
}
