import { FC } from 'react';
import { ActionIcon, Button, Flex, ScrollArea, Select, Stack, Text, Textarea, TextInput, Tooltip } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from '@core/hooks';
import { SecureChip } from './SecureChip';
import { HttpOnlyChip } from './HttpOnlyChip';
import { SessionChip } from './SessionChip';
import { useModeValue } from '@core/theme/provider.tsx';
import { useCookieEditorForm } from './useCookieEditorForm';

type Cookie = chrome.cookies.Cookie;

export type CookieEditorProps = {
  cookie?: Cookie;
  onClose: () => void;
};

export const CookieEditor: FC<CookieEditorProps> = ({ cookie, onClose }) => {
  const t = useTranslation('cookie_editor');
  const { form, submit } = useCookieEditorForm({ cookie, onClose });

  const rows = useModeValue<number>({
    'popup': () => 3,
    'sidebar': () => 5,
  });

  return (
    <Flex direction="column" flex={1} style={{ overflow: 'hidden' }}>
      <Flex direction="row" align="center" gap="xs" p="xs">
        <Tooltip label={t('back')}>
          <ActionIcon aria-label={t('back')} onClick={onClose}>
            <IconArrowLeft size={16}/>
          </ActionIcon>
        </Tooltip>
        <Text fw={500}>
          {cookie ? t('title_edit') : t('title_add')}
        </Text>
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
            <Textarea
              label={t('value_label')}
              rows={rows}
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
            <Flex direction="row" gap="xs">
              <SecureChip
                key={form.key('secure')}
                {...form.getInputProps('secure', { type: 'checkbox' })}
              />
              <HttpOnlyChip
                key={form.key('httpOnly')}
                {...form.getInputProps('httpOnly', { type: 'checkbox' })}
              />
              <SessionChip
                key={form.key('session')}
                {...form.getInputProps('session', { type: 'checkbox' })}
              />
            </Flex>
            <DateTimePicker
              key={form.key('expirationDate')}
              label={t('expiration_label')}
              disabled={form.values.session}
              withAsterisk={!form.values.session}
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
