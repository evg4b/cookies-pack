import { Table } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { type FC, useCallback, useMemo } from 'react';
import { useCookieEditors, useTranslation } from '@core/hooks';
import { CookiesTableCell } from './CookiesTableCell';
import { ActionsCell } from './ActionsCell';
import { IconButton } from '../IconButton';
import { CookieTooltip } from '@core/components/CookiesTable/CookieTooltip';

export interface CookieTableRowProps {
  cookie: Cookie;
  removeCookie: (cookieName: string) => Promise<void>;
  onEdit: (cookie: Cookie) => void;
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

  const tooltip = useMemo(() => <CookieTooltip cookie={cookie}/>, [cookie]);

  return (
    <Table.Tr>
      <CookiesTableCell tooltip={tooltip} value={cookie.name}/>
      <CookiesTableCell tooltip={tooltip} visibleFrom="xs" value={cookie.path}/>
      <CookiesTableCell tooltip={tooltip} value={cookie.value}/>
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

