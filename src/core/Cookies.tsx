import { CookiesTable } from '@core/CookiesTable';
import { Button, Input, TextArea, Separator, Label, Switch } from '@heroui/react';
import { useSiteCookies, useTabs } from '@shared/hooks';
import { PageContext, useWindowSize } from '@shared/hooks/page';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SetDetails = chrome.cookies.SetDetails;

const split = (header: string | null | undefined, url: string, path: string): SetDetails[] => {
  return header
    ? header.split(/;\n?/)
      .map<SetDetails>(line => {
        const trimmed = line.trim();
        const eqIdx = trimmed.indexOf('=');
        const name = eqIdx === -1 ? trimmed : trimmed.slice(0, eqIdx);
        const value = eqIdx === -1 ? '' : trimmed.slice(eqIdx + 1);

        return { url, path, name, value };
      })
      .filter(({ name }) => name.length > 0)
    : [];
};

const value = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): string =>
  event.target.value;

const join = (cookies: Cookie[]): string => cookies
  .map((cookie) => cookie.name + '=' + encodeURIComponent(cookie.value)).join(';\n');

const Cookies = () => {
  useWindowSize(800, null);

  const { t } = useTranslation();
  const tabs = useTabs();
  const { clipboard, saveFile } = useContext(PageContext);

  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const { cookies, refresh, set, remove, removeAll } = useSiteCookies(currentUrl);

  useEffect(
    () =>
      tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab.url) {
          return;
        }

        setCurrentUrl(tab.url);
        setCurrentPath(new URL(tab.url).pathname);
      }),
    [tabs],
  );

  useEffect(() => {
    if (currentUrl) {
      void refresh();
    }
  }, [currentUrl, refresh]);

  const setCookiesCallback = useCallback(
    async (clear: boolean, path: string, newCookies: string) => {
      if (clear) {
        await removeAll();
      }

      try {
        await Promise.all(
          split(newCookies, currentUrl, path).map((cookie) =>
            set({
              ...cookie,
              value: decodeURIComponent(cookie.value ?? ''),
            }),
          ),
        );

        await refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : String(err));
      }
    },
    [currentUrl, removeAll, set, refresh],
  );

  const saveToCookieFile = useCallback(async (data: string) => {
    await saveFile(data, {
      suggestedName: t('export.filename'),
      types: [
        {
          description: t('export.description'),
          accept: { 'text/plain': ['.cookies'] },
        },
      ],
    });
  }, [saveFile, t]);

  const [customPath, setCustomPath] = useState(false);
  const [path, setPath] = useState('/');
  const [newCookies, setNewCookies] = useState('');
  const [clear, setClear] = useState(true);

  useEffect(() => {
    setPath(customPath ? currentPath : '/');
  }, [customPath, currentPath]);

  const updateCookies = useCallback(() => {
    void setCookiesCallback(clear, path, newCookies)
      .then(() => setNewCookies(''));
  }, [setCookiesCallback, clear, path, newCookies, setNewCookies]);

  const copyToClipboard = useCallback(async (value: string | Cookie[]) => {
    if (Array.isArray(value)) {
      await clipboard.writeText(join(value));
    } else {
      await clipboard.writeText(value);
    }
  }, [clipboard]);

  const deleteCookie = useCallback(async ({ name, storeId }: Cookie) => {
    await remove({ name, storeId, url: currentUrl });
  }, [remove, currentUrl]);

  return (
    <div className="flex flex-col gap-2">
      <CookiesTable cookies={cookies}
                    copyToClipboard={copyToClipboard}
                    saveToCookieFile={saveToCookieFile}
                    deleteCookie={deleteCookie}
      />
      <Separator variant="tertiary"/>
      <TextArea rows={7}
                minRows={7}
                maxRows={7}
                value={newCookies}
                onInput={(event) => setNewCookies(value(event))}
                placeholder={t('input.placeholder')}/>
      <div className="flex flex-row gap-2 w-full">
        <Input placeholder={t('input.path_placeholder')}
               className="flex-1"
               disabled={!customPath}
               value={customPath ? path : ''}
               onChange={(event) => setPath(value(event))}/>
        <Switch isSelected={customPath} onChange={setCustomPath}>
          <Switch.Control>
            <Switch.Thumb/>
          </Switch.Control>
          <Switch.Content>
            <Label className="text-sm">{t('input.path_label')}</Label>
          </Switch.Content>
        </Switch>
      </div>
      <div className="flex flex-row justify-between">
        <Switch isSelected={clear} onChange={setClear}>
          <Switch.Control>
            <Switch.Thumb/>
          </Switch.Control>
          <Switch.Content>
            <Label className="text-sm">
              {t('clear_first.label')}
            </Label>
          </Switch.Content>
        </Switch>
        <Button size="sm" color="primary" onPress={updateCookies}>
          {clear ? t('replace_cookies') : t('add_cookies')}
        </Button>
      </div>
    </div>
  );
};

export default Cookies;
