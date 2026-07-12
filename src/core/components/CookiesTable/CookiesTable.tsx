import { FC, useCallback } from 'react';
import { ActionIcon, EmptyState, Flex, Table, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCookieOff, IconCopy, IconDownload, IconPlus } from '@tabler/icons-react';
import { useCookieEditorEnabled, useCookies, useSaveFile, useTranslation } from '@core/hooks';
import { encodeJetbrainsCookies, joinCookiesHeader } from '@core/utils';
import { CookieTableRow } from './CookieTableRow';
import { ActionsCell } from '@core/components/CookiesTable/ActionsCell.tsx';

export type CookiesTableProps = {
  onAddCookie: () => void;
  onEditCookie: (cookie: chrome.cookies.Cookie) => void;
};

export const CookiesTable: FC<CookiesTableProps> = ({ onAddCookie, onEditCookie }) => {
  const { cookies, removeCookie } = useCookies();
  const t = useTranslation('cookies_table');
  const { copy, copied } = useClipboard({ timeout: 1500 });
  const { saveFile } = useSaveFile();
  const [cookieEditorEnabled] = useCookieEditorEnabled();

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

  const addCookieAction = cookieEditorEnabled && (
    <Tooltip label={t('add_cookie')}>
      <ActionIcon aria-label={t('add_cookie')} onClick={onAddCookie}>
        <IconPlus size={16}/>
      </ActionIcon>
    </Tooltip>
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
      onEdit={cookieEditorEnabled ? onEditCookie : undefined}
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
              <Tooltip label={t('copy_all_cookies')}>
                <ActionIcon
                  aria-label={t('copy_all_cookies')}
                  color={copied ? 'green' : undefined}
                  variant={copied ? 'filled' : 'subtle'}
                  onClick={copyAll}
                >
                  {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t('export_all_cookies')}>
                <ActionIcon aria-label={t('export_all_cookies')} onClick={exportAll}>
                  <IconDownload size={16}/>
                </ActionIcon>
              </Tooltip>
            </ActionsCell>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
