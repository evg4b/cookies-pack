import { Flex, Table, Tooltip, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { type FC, useCallback } from 'react';
import { useTranslation } from '@core/hooks';

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
        <Tooltip label={cookie.name ?? 'N/A'} openDelay={300}>
          <span>{cookie.name ?? 'N/A'}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label={cookie.path ?? 'N/A'} openDelay={300}>
          <span>{cookie.path ?? 'N/A'}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td style={{ maxWidth: '390px' }}>
        <Tooltip label={cookie.value ?? 'N/A'} openDelay={300}>
          <Flex style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {cookie.value ?? 'N/A'}
          </Flex>
        </Tooltip>
      </Table.Td>
      <Table.Td width="10%">
        <Tooltip label={t('delete_cookie')} openDelay={300}>
          <UnstyledButton
            aria-label={t('delete_cookie')}
            style={{ cursor: 'pointer' }}
            onClick={removeCookieCallback}
          >
            <IconTrash size={16}/>
          </UnstyledButton>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  );
};
