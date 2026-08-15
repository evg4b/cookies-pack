import { useSyncExternalStore } from 'react';
import { type CookiesState, CookiesStore, type SetCookieDetails } from '@core/stores/CookiesStore';

const store = new CookiesStore();

export interface UseCookiesReturn extends CookiesState {
  setCookie: (name: string, value: string, details?: SetCookieDetails) => Promise<Cookie | null>;
  removeCookie: (name: string, url?: string) => Promise<void>;
  removeAllCookies: () => Promise<void>;
  getCookie: (name: string) => Cookie | undefined;
  refresh: () => Promise<void>;
}

export const useCookies = (): UseCookiesReturn => {
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store),
  );

  return {
    ...state,
    setCookie: store.setCookie.bind(store),
    removeCookie: store.removeCookie.bind(store),
    removeAllCookies: store.removeAllCookies.bind(store),
    getCookie: store.getCookie.bind(store),
    refresh: store.refresh.bind(store),
  };
};
