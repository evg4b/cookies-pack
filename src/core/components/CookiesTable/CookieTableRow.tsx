import { Table } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { type FC, useCallback } from 'react';
import { useCookieEditors, useTranslation } from '@core/hooks';
import { CookiesTableCell } from './CookiesTableCell';
import { ActionsCell } from './ActionsCell';
import { IconButton } from '../IconButton.tsx';

export type CookieTableRowProps = {
  cookie: chrome.cookies.Cookie
  removeCookie: (cookieName: string) => void
  onEdit: (cookie: chrome.cookies.Cookie) => void
}

export const CookieTableRow: FC<CookieTableRowProps> = ({ cookie, removeCookie, onEdit }) => {
  const t = useTranslation('cookies_table');
  const { editorEnabled } = useCookieEditors();
  const removeCookieCallback = useCallback(
    () => void removeCookie(cookie.name),
    [removeCookie, cookie.name],
  );

  const editCookieCallback = useCallback(
    () => onEdit(cookie),
    [onEdit, cookie],
  );

  return (
    <Table.Tr>
      <CookiesTableCell value={cookie.name ?? 'N/A'}/>
      <CookiesTableCell visibleFrom="xs" value={cookie.path ?? 'N/A'}/>
      <CookiesTableCell value={cookie.value ?? 'N/A'}/>
      <ActionsCell>
        {editorEnabled && (
          <IconButton
            label={t('edit_cookie')}
            onClick={editCookieCallback}
            icon={IconPencil}
          />
        )}
        <IconButton
          label={t('delete_cookie')}
          onClick={removeCookieCallback}
          icon={IconTrash}
          color="red"
        />
      </ActionsCell>
    </Table.Tr>
  );
};

