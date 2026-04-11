import { useCallback, useState } from 'react';
import { useCookies } from './with-chrome';

export const useSiteCookies = (url: string) => {
  const cookiesApi = useCookies();
  const [cookies, setCookies] = useState<Cookie[]>([]);

  const refresh = useCallback(async () => {
    const siteCookies = await cookiesApi.getAll({ url });
    setCookies(siteCookies);
  }, [cookiesApi, url]);

  const set = useCallback(async (details: chrome.cookies.SetDetails) => {
    await cookiesApi.set(details);
    await refresh();
  }, [cookiesApi, refresh]);

  const remove = useCallback(async (details: chrome.cookies.CookieDetails) => {
    await cookiesApi.remove(details);
    await refresh();
  }, [cookiesApi, refresh]);

  const removeAll = useCallback(async () => {
    const list = await cookiesApi.getAll({ url });
    await Promise.all(list.map(({ name }) => cookiesApi.remove({ url, name })));
  }, [cookiesApi, url]);

  return { cookies, refresh, set, remove, removeAll };
};
