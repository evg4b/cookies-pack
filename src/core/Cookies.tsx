import { CookiesTable } from '@core/CookiesTable';
import { Button, Checkbox, Divider, Input, Textarea } from '@nextui-org/react';
import { useCookies, useTabs } from '@shared/hooks';
import { PageContext, useWindowSize } from '@shared/hooks/page';
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';

type SetDetails = chrome.cookies.SetDetails;

export const split = (header: string, url: string, path: string): SetDetails[] => {
  if (!header) {
    return [];
  }

  return header.split(/;\n?/)
    .map<SetDetails>(line => {
      const keyVal = line.split('=');
      const name = keyVal[0];
      const value = keyVal.length > 1 ? keyVal[1] : '';

      return { url, value, name, path };
    });
};

const value = (event: Event | React.FormEvent<HTMLElement>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event?.target as any).value;

const checked = (event: ChangeEvent<HTMLInputElement>) => event.target.checked;

const join = (cookies: Cookie[]): string => {
  return cookies.map((cookie) => cookie.name + '=' + encodeURIComponent(cookie.value)).join(';\n');
};

export const Cookies = () => {
  useWindowSize(800, 500);

  const tabs = useTabs();
  const cookiesJar = useCookies();
  const { clipboard } = useContext(PageContext);

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
          cookiesJar.set({
            ...cookie,
            value: decodeURIComponent(cookie.value ?? ''),
          }),
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

  const [customPath, setCustomPath] = useState(false);
  const [path, setPath] = useState('/');
  const [newCookies, setNewCookies] = useState('');
  const [clear, setClear] = useState(true);

  useEffect(() => {
    setPath(customPath ? currentPath : '/');
  }, [customPath, currentPath]);

  const updateCookies = useCallback(() => {
    setCookiesCallback(clear, path, newCookies);
    setNewCookies('');
  }, [setCookiesCallback, clear, path, newCookies, setNewCookies]);

  const copyToClipboard = useCallback(async (value: string | Cookie[]) => {
    if (Array.isArray(value)) {
      await clipboard.writeText(join(value));
    } else {
      await clipboard.writeText(value);
    }
  }, [clipboard]);

  const deleteCookie = useCallback(async ({ name, storeId }: Cookie) => {
    await cookiesJar.remove({ name, storeId, url: currentUrl });
    const siteCookies = await cookiesJar.getAll({ url: currentUrl });
    setCookies(siteCookies);
  }, [cookies, currentUrl]);

  return (
    <div className="flex flex-col gap-2">
      <CookiesTable cookies={ cookies } copyToClipboard={ copyToClipboard } deleteCookie={ deleteCookie }/>
      <Divider className="my-4"/>
      <Textarea rows={ 7 } minRows={ 7 } maxRows={ 7 } value={ newCookies } onInput={ (event) => setNewCookies(value(event)) }
                placeholder="Update cookies with a cookie header, e.g. foo=bar; bat=baz; oof=rab"/>
      <div className="flex flex-row justify-between gap-2">
        <Input
          placeholder="Cookies path"
          disabled={ !customPath }
          value={ customPath ? path : '' }
          onChange={ (event) => setPath(value(event)) }
        />
        <Checkbox isSelected={ customPath } onChange={ (event) => setCustomPath(checked(event)) }>
          <div className="whitespace-nowrap">
            Custom path
          </div>
        </Checkbox>
      </div>
      <div className="flex flex-row justify-between">
        <Checkbox isSelected={ clear } onChange={ (event) => setClear(checked(event)) }>
          Clear existing cookies first
        </Checkbox>
        <Button size="sm" color="primary" variant="solid" onClick={ updateCookies }>
          Set Cookies
        </Button>
      </div>
    </div>
  );
};
