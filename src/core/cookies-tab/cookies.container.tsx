import React, { useCallback, useEffect, useState } from 'react';
import { Cookies } from './cookies';
import { useCookies, useTabs } from '@shared/hooks/with-chrome';
import { Tab, Tabs } from '@shared/components';
import Cookie = chrome.cookies.Cookie;

const join = (cookies: Cookie[]): string => {
  return cookies.map((cookie) => cookie.name + '=' + cookie.value).join(';\n');
};

const split = (header: string, url: string, path: string): chrome.cookies.SetDetails[] => {
  const cookiesLines = header.split(/;\n*/);

  return cookiesLines.map<chrome.cookies.SetDetails>((line) => {
    const keyVal = line.split('=');
    const name = keyVal[0];
    const value = keyVal.length > 1 ? keyVal[1] : '';

    return { url, value, name, path };
  });
};

export const CookiesContainer = () => {
  const tabs = useTabs();
  const cookies = useCookies();

  const [enabled, setEnabled] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [currentCookies, setCurrentCookies] = useState<string>('');

  useEffect(
    () =>
      tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        if (!tab.url) {
          return setEnabled(false);
        }

        setCurrentUrl(tab.url);
        setCurrentPath(new URL(tab.url).pathname);
        const siteCookies = await cookies.getAll({ url: tab.url ?? '' });
        setCurrentCookies(join(siteCookies));
      }),
    [tabs, cookies],
  );

  const setCookiesCallback = useCallback(
    async (clear: boolean, path: string, newCookies: string) => {
      if (clear) {
        const cookiesList = await cookies.getAll({ url: currentUrl });
        const promises = cookiesList.map(({ name }) =>
          cookies.remove({ url: currentUrl, name }),
        );
        await Promise.all(promises);
      }

      try {
        const promises = split(newCookies, currentUrl, path).map((cookie) =>
          cookies.set(cookie),
        );

        await Promise.all(promises);

        const siteCookies = await cookies.getAll({ url: currentUrl });
        setCurrentCookies(join(siteCookies));
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        alert(err.message);
      }
    },
    [cookies, currentUrl],
  );

  return (
    <>
      { enabled && (
        <Tabs defaultTab="demo">
          <Tab tabId="demo" tabName="Bulk editor">
            <Cookies
              current={ currentCookies }
              currentPath={ currentPath }
              setCookies={ setCookiesCallback }
            />

          </Tab>
        </Tabs>
      ) }
      { !enabled && <div>This page is not supported</div> }
    </>
  );
};
