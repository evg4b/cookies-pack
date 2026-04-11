import { CookiesTable } from '@core/CookiesTable';
import { Icon } from '@iconify/react';
import { Button, Input, Label, Modal, Separator, Switch, TextArea } from '@heroui/react';
import { useCookies, useSettings, useTabs } from '@shared/hooks';
import { PageContext, useWindowSize } from '@shared/hooks/page';
import React, { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SetDetails = chrome.cookies.SetDetails;

export const split = (header: string | null | undefined, url: string, path: string): SetDetails[] => {
  return header
    ? header.split(/;\n?/)
      .map<SetDetails>(line => {
        const [name, value] = line.split('=');

        return { url, path, name, value: value ?? '' };
      })
    : [];
};

const value = (event: Event | React.FormEvent<HTMLElement>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event?.target as any).value;

const join = (cookies: Cookie[]): string => cookies
  .map((cookie) => cookie.name + '=' + encodeURIComponent(cookie.value)).join(';\n');

const Cookies = () => {
  useWindowSize(800, null);

  const { t } = useTranslation();
  const tabs = useTabs();
  const cookiesJar = useCookies();
  const { clipboard, saveFile } = useContext(PageContext);

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

  const saveToCookieFile = useCallback(async (data: string) => {
    await saveFile(data, {
      suggestedName: 'demo.cookies',
      types: [
        {
          description: 'JetBrains IDE cookies',
          accept: { 'text/plain': ['.cookies'] },
        },
      ],
    });
  }, [saveFile]);

  const { settings, loading: settingsLoading, updateSetting } = useSettings();
  const settingsApplied = useRef(false);

  const [customPath, setCustomPath] = useState(false);
  const [path, setPath] = useState('/');
  const [newCookies, setNewCookies] = useState('');
  const [clear, setClear] = useState(true);

  useEffect(() => {
    if (!settingsLoading && !settingsApplied.current) {
      settingsApplied.current = true;
      setCustomPath(settings.useCustomPath);
      setClear(settings.clearExistingCookiesFirst);
    }
  }, [settingsLoading, settings]);

  useEffect(() => {
    setPath(customPath ? currentPath : '/');
  }, [customPath, currentPath]);

  const updateCookies = useCallback(() => {
    setCookiesCallback(clear, path, newCookies)
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
    await cookiesJar.remove({ name, storeId, url: currentUrl });
    const siteCookies = await cookiesJar.getAll({ url: currentUrl });
    setCookies(siteCookies);
  }, [cookies, currentUrl]);

  return (
    <Modal.Root>
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
                  res
                  onInput={(event) => setNewCookies(value(event))}
                  placeholder="Update cookies with a cookie header, e.g. foo=bar; bat=baz; oof=rab"/>
        <div className="flex flex-row gap-2 w-full">
          <Input placeholder="Cookies path"
                 className="flex-1"
                 disabled={!customPath}
                 value={customPath ? path : ''}
                 onChange={(event) => setPath(value(event))}/>
          <Switch isSelected={customPath} onChange={setCustomPath}>
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">Custom path</Label>
            </Switch.Content>
          </Switch>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Switch isSelected={clear} onChange={setClear}>
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">
                {t('clear_existing_cookies_first')}
              </Label>
            </Switch.Content>
          </Switch>
          <div className="flex flex-row gap-1 items-center">
            <Modal.Trigger>
              <Button isIconOnly size="sm" variant="tertiary" aria-label={t('settings.open')}>
                <Icon icon="heroicons-solid:cog"/>
              </Button>
            </Modal.Trigger>
            <Button size="sm" color="primary" onPress={updateCookies}>
              {clear ? t('replace_cookies') : t('add_cookies')}
            </Button>
          </div>
        </div>
      </div>

      <Modal.Backdrop/>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>{t('settings.title')}</Modal.Heading>
            <Modal.CloseTrigger>
              <Button isIconOnly size="sm" variant="ghost" aria-label={t('settings.close')}>
                <Icon icon="heroicons-solid:x"/>
              </Button>
            </Modal.CloseTrigger>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4 pb-6">
            <Switch
              isSelected={settings.clearExistingCookiesFirst}
              onChange={(val) => updateSetting('clearExistingCookiesFirst', val)}
            >
              <Switch.Control>
                <Switch.Thumb/>
              </Switch.Control>
              <Switch.Content>
                <Label className="text-sm">{t('clear_existing_cookies_first')}</Label>
              </Switch.Content>
            </Switch>
            <Switch
              isSelected={settings.useCustomPath}
              onChange={(val) => updateSetting('useCustomPath', val)}
            >
              <Switch.Control>
                <Switch.Thumb/>
              </Switch.Control>
              <Switch.Content>
                <Label className="text-sm">{t('use_custom_path')}</Label>
              </Switch.Content>
            </Switch>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Root>
  );
};

export default Cookies;
