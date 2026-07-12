import { FC, useCallback, useEffect } from 'react';
import { ActionIcon, Button, Flex, ScrollArea, Select, Stack, Switch, Text, TextInput, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { useCookies, useTabs, useTranslation } from '@core/hooks';

type Cookie = chrome.cookies.Cookie;
type SameSite = Cookie['sameSite'];

export type CookieEditorProps = {
  cookie?: Cookie;
  onClose: () => void;
};

interface CookieFormValues {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: SameSite;
  session: boolean;
  expirationDate: string;
}

const pad = (value: number): string => value.toString().padStart(2, '0');

const toDatetimeLocal = (seconds: number): string => {
  const date = new Date(seconds * 1000);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromDatetimeLocal = (value: string): number => Math.floor(new Date(value).getTime() / 1000);

const defaultExpiration = (): string => toDatetimeLocal(Math.floor(Date.now() / 1000) + 24 * 60 * 60);

const buildUrl = (domain: string, path: string, secure: boolean): string =>
  `${secure ? 'https' : 'http'}://${domain.replace(/^\./, '')}${path || '/'}`;

const emptyValues: CookieFormValues = {
  name: '',
  value: '',
  domain: '',
  path: '/',
  secure: false,
  httpOnly: false,
  sameSite: 'lax',
  session: true,
  expirationDate: defaultExpiration(),
};

const cookieToValues = (cookie: Cookie): CookieFormValues => ({
  name: cookie.name,
  value: cookie.value,
  domain: cookie.domain,
  path: cookie.path,
  secure: cookie.secure,
  httpOnly: cookie.httpOnly,
  sameSite: cookie.sameSite,
  session: cookie.session,
  expirationDate: cookie.expirationDate ? toDatetimeLocal(cookie.expirationDate) : defaultExpiration(),
});

export const CookieEditor: FC<CookieEditorProps> = ({ cookie, onClose }) => {
  const t = useTranslation('cookie_editor');
  const tabs = useTabs();
  const { setCookie, removeCookie } = useCookies();

  const form = useForm<CookieFormValues>({
    initialValues: cookie ? cookieToValues(cookie) : emptyValues,
    validate: {
      name: (value) => (value.trim() ? null : t('error_required')),
      domain: (value) => (value.trim() ? null : t('error_required')),
      path: (value) => (value.startsWith('/') ? null : t('error_path')),
      expirationDate: (value, values) => (!values.session && !value ? t('error_required') : null),
    },
  });

  useEffect(() => {
    if (cookie) {
      return;
    }

    let cancelled = false;

    void tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (cancelled || !tab.url) {
        return;
      }

      const url = new URL(tab.url);
      form.setFieldValue('domain', url.hostname);
      form.setFieldValue('path', url.pathname);
      form.setFieldValue('secure', url.protocol === 'https:');
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie, tabs]);

  const submit = useCallback(
    (values: CookieFormValues) => {
      void (async () => {
        const url = buildUrl(values.domain, values.path, values.secure);

        if (cookie && (cookie.name !== values.name || cookie.domain !== values.domain || cookie.path !== values.path)) {
          await removeCookie(cookie.name, buildUrl(cookie.domain, cookie.path, cookie.secure));
        }

        await setCookie(values.name, values.value, {
          url,
          domain: values.domain,
          path: values.path,
          secure: values.secure,
          httpOnly: values.httpOnly,
          sameSite: values.sameSite,
          expirationDate: values.session ? undefined : fromDatetimeLocal(values.expirationDate),
          storeId: cookie?.storeId,
        });

        onClose();
      })();
    },
    [cookie, removeCookie, setCookie, onClose],
  );

  return (
    <Flex direction="column" flex={1} style={{ overflow: 'hidden' }}>
      <Flex direction="row" align="center" gap="xs" p="xs">
        <Tooltip label={t('back')}>
          <ActionIcon aria-label={t('back')} onClick={onClose}>
            <IconArrowLeft size={16}/>
          </ActionIcon>
        </Tooltip>
        <Text fw={500}>{cookie ? t('title_edit') : t('title_add')}</Text>
      </Flex>
      <ScrollArea flex={1} px="xs">
        <form id="cookie-editor-form" onSubmit={form.onSubmit(submit)}>
          <Stack gap="sm" pb="xs">
            <TextInput
              label={t('name_label')}
              placeholder={t('name_placeholder')}
              withAsterisk
              key={form.key('name')}
              {...form.getInputProps('name')}
            />
            <TextInput
              label={t('value_label')}
              placeholder={t('value_placeholder')}
              key={form.key('value')}
              {...form.getInputProps('value')}
            />
            <TextInput
              label={t('domain_label')}
              placeholder={t('domain_placeholder')}
              withAsterisk
              key={form.key('domain')}
              {...form.getInputProps('domain')}
            />
            <TextInput
              label={t('path_label')}
              placeholder={t('path_placeholder')}
              withAsterisk
              key={form.key('path')}
              {...form.getInputProps('path')}
            />
            <Select
              label={t('same_site_label')}
              data={[
                { value: 'no_restriction', label: t('same_site_no_restriction') },
                { value: 'lax', label: t('same_site_lax') },
                { value: 'strict', label: t('same_site_strict') },
                { value: 'unspecified', label: t('same_site_unspecified') },
              ]}
              allowDeselect={false}
              key={form.key('sameSite')}
              {...form.getInputProps('sameSite')}
            />
            <Switch
              label={t('secure_label')}
              key={form.key('secure')}
              {...form.getInputProps('secure', { type: 'checkbox' })}
            />
            <Switch
              label={t('http_only_label')}
              key={form.key('httpOnly')}
              {...form.getInputProps('httpOnly', { type: 'checkbox' })}
            />
            <Switch
              label={t('session_label')}
              key={form.key('session')}
              {...form.getInputProps('session', { type: 'checkbox' })}
            />
            <TextInput
              type="datetime-local"
              label={t('expiration_label')}
              disabled={form.values.session}
              withAsterisk={!form.values.session}
              key={form.key('expirationDate')}
              {...form.getInputProps('expirationDate')}
            />
          </Stack>
        </form>
      </ScrollArea>
      <Flex direction="row" justify="flex-end" gap="xs" p="xs">
        <Button variant="default" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button type="submit" form="cookie-editor-form">
          {t('save')}
        </Button>
      </Flex>
    </Flex>
  );
};
