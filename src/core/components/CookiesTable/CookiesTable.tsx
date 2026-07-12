import { FC, useCallback } from 'react';
import { EmptyState, Flex, Table } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCookieOff, IconCopy, IconDownload, IconPlus } from '@tabler/icons-react';
import { useCookieEditors, useCookies, useSaveFile, useTranslation } from '@core/hooks';
import { encodeJetbrainsCookies, joinCookiesHeader } from '@core/utils';
import { CookieTableRow } from './CookieTableRow';
import { ActionsCell } from './ActionsCell';
import { IconButton } from '@core/components';

export type CookiesTableProps = {
  onAddCookie: () => void;
  onEditCookie: (cookie: chrome.cookies.Cookie) => void;
};

export const CookiesTable: FC<CookiesTableProps> = ({ onAddCookie, onEditCookie }) => {
  const { cookies, removeCookie } = useCookies();
  const t = useTranslation('cookies_table');
  const { copy, copied } = useClipboard({ timeout: 500 });
  const { saveFile } = useSaveFile();
  const { editorEnabled, bulkEditorEnabled } = useCookieEditors();

  const copyAll = useCallback(() => {
    copy(joinCookiesHeader(cookies));
  }, [copy, cookies]);

  const exportAll = useCallback(() => {
    void saveFile(encodeJetbrainsCookies(cookies), {
      suggestedName: t('export_filename'),
      types: [
        {
          description: t('export_description'),
          accept: { 'text/plain': ['.cookies'] },
        },
      ],
    });
  }, [saveFile, cookies, t]);

  const addCookieAction = editorEnabled && (
    <IconButton
      label={t('add_cookie')}
      onClick={onAddCookie}
      icon={IconPlus}
    />
  );

  if (!cookies.length) {
    return (
      <Flex direction="column" flex={1}>
        <Flex justify="flex-end" p="xs">
          {addCookieAction}
        </Flex>
        <Flex direction="column" flex={1} align="center" justify="center">
          <EmptyState
            icon={<IconCookieOff/>}
            title={t('empty_title')}
            description={t('empty_description')}
          />
        </Flex>
      </Flex>
    );
  }

  const rows = cookies.map((element) => (
    <CookieTableRow
      cookie={element}
      removeCookie={removeCookie}
      onEdit={onEditCookie}
      key={element.name + element.domain + element.path}
    />
  ));

  return (
    <Table.ScrollContainer minWidth={10} flex={1}>
      <Table striped stickyHeader layout="fixed" width="100%">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="25%">{t('columns_name')}</Table.Th>
            <Table.Th w="15%" visibleFrom="xs">{t('columns_path')}</Table.Th>
            <Table.Th>{t('columns_value')}</Table.Th>
            <ActionsCell Component={Table.Th}>
              {addCookieAction}
              {bulkEditorEnabled && (
                <IconButton
                  label={t('copy_all_cookies')}
                  onClick={copyAll}
                  icon={copied ? IconCheck : IconCopy}
                  color={copied ? 'green' : undefined}
                  variant={(copied ? 'filled' : 'subtle')}
                />
              )}
              <IconButton
                label={t('export_all_cookies')}
                onClick={exportAll}
                icon={IconDownload}
              />
            </ActionsCell>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
