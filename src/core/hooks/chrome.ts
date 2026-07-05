import { createContext, useContext, useSyncExternalStore } from 'react';

export const ChromeContext = createContext(chrome);

export const useTabs = () => {
  const chrome = useContext(ChromeContext);
//  assertIsDefined(chrome.tabs, 'No access to tabs');

  return chrome.tabs;
};

type Cookie = chrome.cookies.Cookie;

function createCookiesStore() {
  let cookies: Cookie[] = [];
  const listeners = new Set<() => void>();

  const emit = () => {
    listeners.forEach(l => l());
  };

  const load = async () => {
    cookies = await chrome.cookies.getAll({});
    emit();
  };

  const handleChange = async () => {
    // проще и надёжнее: пересчитать snapshot
    cookies = await chrome.cookies.getAll({});
    emit();
  };

  // подписка на изменения Chrome
  chrome.cookies.onChanged.addListener(handleChange);

  // initial load
  load();

  return {
    getSnapshot: () => cookies,
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    refresh: load,
  };
}

const store = createCookiesStore();

export function useCookies() {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
}
