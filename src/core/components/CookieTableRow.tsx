import { Flex, Table, Tooltip, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { type FC, useCallback } from 'react';
import { useTranslation } from '@core/hooks';
import { CookiesTableCell } from '@core/components/CookiesTableCell.tsx';

export type CookieTableRowProps = {
  cookie: chrome.cookies.Cookie
  removeCookie: (cookieName: string) => void
}

export const CookieTableRow: FC<CookieTableRowProps> = ({ cookie, removeCookie }) => {

  const t = useTranslation('cookies_table');

  const removeCookieCallback = useCallback(() => {
    removeCookie(cookie.name);
  }, [removeCookie, cookie.name]);

  return (
    <Table.Tr>
      <Table.Td>
        <CookiesTableCell value={cookie.name ?? 'N/A'}/>
      </Table.Td>
      <Table.Td visibleFrom="xs">
        <CookiesTableCell value={cookie.path ?? 'N/A'}/>
      </Table.Td>
      <Table.Td>
        <CookiesTableCell value={cookie.value ?? 'N/A'}/>
      </Table.Td>
      <Table.Td>
        <Flex justify="flex-end" pr='l'>
          <Tooltip label={t('delete_cookie')}>
            <UnstyledButton
              aria-label={t('delete_cookie')}
              style={{ cursor: 'pointer' }}
              onClick={removeCookieCallback}
            >
              <IconTrash size={16}/>
            </UnstyledButton>
          </Tooltip>
        </Flex>
      </Table.Td>
    </Table.Tr>
  );
};
