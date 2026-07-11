import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Button, Chip, Flex, Input, PolymorphicComponentProps, Textarea } from '@mantine/core';
import { useClearExistingCookiesFirst, useCookies, useCustomPath, useTabs, useTranslation } from '@core/hooks';
import { parseCookieHeader } from '@core/utils';
import { useModeValue } from '@core/theme/provider.tsx';
import { IconTrash } from '@tabler/icons-react';

export type CookiesBatchUpdateProps = PolymorphicComponentProps<'div'>;

const textValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): string => event.target.value;

export const CookiesBatchUpdate: FC<CookiesBatchUpdateProps> = (props) => {
  const t = useTranslation('cookies_batch_update');
  const tabs = useTabs();
  const { setCookie, removeAllCookies } = useCookies();
  const [clearFirst, setClearFirst] = useClearExistingCookiesFirst();
  const [customPath, setCustomPath] = useCustomPath();

  const [currentUrl, setCurrentUrl] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [path, setPath] = useState('/');
  const [newCookies, setNewCookies] = useState('');

  useEffect(() => {
    let cancelled = false;

    void tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (cancelled || !tab.url) {
        return;
      }

      setCurrentUrl(tab.url);
      setCurrentPath(new URL(tab.url).pathname);
    });

    return () => {
      cancelled = true;
    };
  }, [tabs]);

  useEffect(() => {
    setPath(customPath ? currentPath : '/');
  }, [customPath, currentPath]);

  const submit = useCallback(() => {
    void (async () => {
      if (clearFirst) {
        await removeAllCookies();
      }

      await Promise.all(
        parseCookieHeader(newCookies, currentUrl, path).map((cookie) =>
          setCookie(cookie.name ?? '', decodeURIComponent(cookie.value ?? ''), { url: currentUrl, path }),
        ),
      );

      setNewCookies('');
    })();
  }, [clearFirst, removeAllCookies, newCookies, currentUrl, path, setCookie]);

  const rows = useModeValue<number>({
    'popup': () => 3,
    'sidebar': () => 5,
  });

  return (
    <Flex {...props} flex={1} gap="xs" direction="column">
      <Textarea
        flex="1 0 auto"
        placeholder={t('placeholder')}
        value={newCookies}
        rows={rows}
        onChange={(event) => setNewCookies(textValue(event))}
      />
      <Flex direction="row" align="center" gap="xs">
        <Input
          flex={1}
          placeholder={t('path_placeholder')}
          disabled={!customPath}
          value={customPath ? path : ''}
          onChange={(event) => setPath(textValue(event))}
        />
        <Chip checked={customPath} variant="light" onChange={setCustomPath}>
          {t('path_label')}
        </Chip>
      </Flex>
      <Flex direction="row" align="center" justify="space-between" gap="xs">
        <Chip icon={<IconTrash size={14}/>} checked={clearFirst} color="red" onChange={setClearFirst}>
          {t('clear_first_label')}
        </Chip>
        <Button onClick={submit}>
          {clearFirst ? t('replace_cookies') : t('add_cookies')}
        </Button>
      </Flex>
    </Flex>
  );
};
