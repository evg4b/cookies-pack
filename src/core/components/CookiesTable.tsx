import { FC, useCallback } from 'react';
import { EmptyState, Flex, Table, UnstyledButton } from '@mantine/core';
import { IconComponentsOff, IconCopy, IconDownload, IconTrash } from '@tabler/icons-react';
import { useCookies, useCopyToClipboard, useSaveFile, useTranslation } from '@core/hooks';
import { encodeJetbrainsCookies, joinCookiesHeader } from '@core/utils';

export interface CookiesTableProps {
  // cookies: chrome.cookies.Cookie[];
}

export const CookiesTable: FC<CookiesTableProps> = ({}) => {
  const { cookies, removeCookie } = useCookies();
  const t = useTranslation('cookies_table');
  const { copy } = useCopyToClipboard();
  const { saveFile } = useSaveFile();

  const copyAll = useCallback(() => {
    void copy(joinCookiesHeader(cookies));
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

  if (!cookies.length) {
    return (
      <EmptyState
        icon={<IconComponentsOff/>}
        title={t('empty_title')}
        description={t('empty_description')}
      />
    );
  }

  const rows = cookies.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name ?? 'N/A'}</Table.Td>
      <Table.Td>{element.path ?? 'N/A'}</Table.Td>
      <Table.Td style={{ maxWidth: '390px' }}>
        <Flex style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {element.value ?? 'N/A'}
        </Flex>
      </Table.Td>
      <Table.Td width="10%">
        <UnstyledButton
          aria-label={t('delete_cookie')}
          style={{ cursor: 'pointer' }}
          onClick={() => void removeCookie(element.name)}
        >
          <IconTrash size={16}/>
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={10}>
      <Table striped stickyHeader width="100%">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('columns_name')}</Table.Th>
            <Table.Th>{t('columns_path')}</Table.Th>
            <Table.Th>{t('columns_value')}</Table.Th>
            <Table.Th>
              <Flex gap="xs" direction="row" justify="flex-end" align="center">
                <UnstyledButton aria-label={t('copy_all_cookies')} onClick={copyAll}>
                  <IconCopy size={16}/>
                </UnstyledButton>
                <UnstyledButton aria-label={t('export_all_cookies')} onClick={exportAll}>
                  <IconDownload size={16}/>
                </UnstyledButton>
              </Flex>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
