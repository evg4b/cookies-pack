import { useWindowSize } from '@shared/hooks/page';
import { useCookies, useTabs } from '@shared/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { Cookies } from './cookies';

export const split = (header: string, url: string, path: string): chrome.cookies.SetDetails[] => {
  const cookiesLines = header.split(/;\n*/);

  return cookiesLines.map<chrome.cookies.SetDetails>((line) => {
    const keyVal = line.split('=');
    const name = keyVal[0];
    const value = keyVal.length > 1 ? keyVal[1] : '';

    return { url, value, name, path };
  });
};

export const CookiesContainer = () => {
  useWindowSize(800, 500);

  const tabs = useTabs();
  const cookiesJar = useCookies();

  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [cookies, setCookies] = useState<Cookie[]>([]);

  useEffect(
    () =>
      tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        if (!tab.url) {
          return;
        }

        setCurrentUrl(tab.url);
        setCurrentPath(new URL(tab.url).pathname);
        const siteCookies = await cookiesJar.getAll({ url: tab.url ?? '' });
        setCookies(siteCookies);
      }),
    [tabs, cookiesJar],
  );

  const setCookiesCallback = useCallback(
    async (clear: boolean, path: string, newCookies: string) => {
      if (clear) {
        const cookiesList = await cookiesJar.getAll({ url: currentUrl });
        const promises = cookiesList.map(({ name }) =>
          cookiesJar.remove({ url: currentUrl, name }),
        );
        await Promise.all(promises);
      }

      try {
        const promises = split(newCookies, currentUrl, path).map((cookie) =>
          cookiesJar.set(cookie),
        );

        await Promise.all(promises);

        const siteCookies = await cookiesJar.getAll({ url: currentUrl });
        setCookies(siteCookies);
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        alert(err.message);
      }
    },
    [cookiesJar, currentUrl],
  );

  return (
    <Cookies
      currentPath={ currentPath }
      setCookies={ setCookiesCallback }
      cookies={ cookies }
    />
  );
};
