import { ActionIcon, Table, Tooltip } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { type FC, useCallback } from 'react';
import { useTranslation } from '@core/hooks';
import { CookiesTableCell } from './CookiesTableCell';
import { ActionsCell } from './ActionsCell';

export type CookieTableRowProps = {
  cookie: chrome.cookies.Cookie
  removeCookie: (cookieName: string) => void
  onEdit?: (cookie: chrome.cookies.Cookie) => void
}

export const CookieTableRow: FC<CookieTableRowProps> = ({ cookie, removeCookie, onEdit }) => {
  const t = useTranslation('cookies_table');

  const removeCookieCallback = useCallback(
    () => void removeCookie(cookie.name),
    [removeCookie, cookie.name],
  );

  const editCookieCallback = useCallback(
    () => onEdit?.(cookie),
    [onEdit, cookie],
  );

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
      <ActionsCell>
        {onEdit && (
          <Tooltip label={t('edit_cookie')}>
            <ActionIcon aria-label={t('edit_cookie')} onClick={editCookieCallback}>
              <IconPencil size={16}/>
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label={t('delete_cookie')}>
          <ActionIcon aria-label={t('delete_cookie')} color="red" onClick={removeCookieCallback}>
            <IconTrash size={16}/>
          </ActionIcon>
        </Tooltip>
      </ActionsCell>
    </Table.Tr>
  );
};
