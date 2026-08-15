import { useSyncExternalStore } from 'react';
import { CookiesState, createCookiesStore, SetCookieDetails } from '@core/stores/createCookiesStore';

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
