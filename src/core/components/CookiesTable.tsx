import { FC, useCallback } from 'react';
import { EmptyState, Flex, Table, Tooltip, UnstyledButton } from '@mantine/core';
import { IconCookieOff, IconCopy, IconDownload } from '@tabler/icons-react';
import { useCookies, useCopyToClipboard, useSaveFile, useTranslation } from '@core/hooks';
import { encodeJetbrainsCookies, joinCookiesHeader } from '@core/utils';
import { CookieTableRow } from '@core/components/CookieTableRow.tsx';

export const CookiesTable: FC = () => {
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
      <Flex direction="column" flex={1} align="center" justify="center">
        <EmptyState
          icon={<IconCookieOff/>}
          title={t('empty_title')}
          description={t('empty_description')}
        />
      </Flex>
    );
  }

  const rows = cookies.map((element) => (
    <CookieTableRow cookie={element} removeCookie={removeCookie} key={element.name + element.domain + element.path}/>
  ));

  return (
    <Table.ScrollContainer minWidth={10} flex={1}>
      <Table striped stickyHeader layout="fixed" width="100%">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="25%">{t('columns_name')}</Table.Th>
            <Table.Th w="15%" visibleFrom="xs">{t('columns_path')}</Table.Th>
            <Table.Th>{t('columns_value')}</Table.Th>
            <Table.Th w={72}>
              <Flex gap="xs" direction="row" justify="flex-end" pr='l' align="center" wrap="nowrap">
                <Tooltip label={t('copy_all_cookies')}>
                  <UnstyledButton aria-label={t('copy_all_cookies')} onClick={copyAll}>
                    <IconCopy size={16}/>
                  </UnstyledButton>
                </Tooltip>
                <Tooltip label={t('export_all_cookies')}>
                  <UnstyledButton aria-label={t('export_all_cookies')} onClick={exportAll}>
                    <IconDownload size={16}/>
                  </UnstyledButton>
                </Tooltip>
              </Flex>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
