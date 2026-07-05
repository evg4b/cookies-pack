import { createContext, useContext, useSyncExternalStore } from 'react';

type Cookie = chrome.cookies.Cookie;
type Listener = () => void;

export const ChromeContext = createContext(chrome);

export const useTabs = () => {
  const chrome = useContext(ChromeContext);
  return chrome.tabs;
};

const createCookiesStore = () => {
  let cookies: Cookie[] = [];
  const listeners = new Set<Listener>();

  const notifyListeners = () => {
    listeners.forEach((listener) => { listener(); });
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
    try {
      const url = await getActiveTabUrl();
      cookies = url ? await chrome.cookies.getAll({ url }) : [];
      notifyListeners();
    } catch (error) {
      console.error('Failed to load cookies:', error);
      cookies = [];
      notifyListeners();
    }
  };

  const handleCookiesChanged = async (): Promise<void> => {
    try {
      const url = await getActiveTabUrl();
      cookies = url ? await chrome.cookies.getAll({ url }) : [];
      notifyListeners();
    } catch (error) {
      console.error('Failed to handle cookie change:', error);
    }
  };

  const handleTabActivated = async (): Promise<void> => {
    await loadCookies();
  };

  const handleTabUpdated = async (_: number, changeInfo: chrome.tabs.OnUpdatedInfo): Promise<void> => {
    if (changeInfo.url) {
      await loadCookies();
    }
  };

  chrome.cookies.onChanged.addListener(handleCookiesChanged);
  chrome.tabs.onActivated.addListener(handleTabActivated);
  chrome.tabs.onUpdated.addListener(handleTabUpdated);

  loadCookies().catch((error) => {
    console.error('Initial cookie load failed:', error);
  });

  return {
    getSnapshot: (): Cookie[] => cookies,
    subscribe: (listener: Listener): (() => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

const store = createCookiesStore();

export function useCookies(): Cookie[] {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
