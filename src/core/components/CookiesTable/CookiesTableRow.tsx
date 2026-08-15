import { Table } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { type FC, useCallback, useMemo } from 'react';
import { useCookieEditors, useTranslation } from '@core/hooks';
import { CookiesTableCell } from './CookiesTableCell';
import { ActionsCell } from './ActionsCell';
import { CookieTooltip } from './CookieTooltip';
import { IconButton } from '../IconButton';

export interface CookiesTableRowProps {
  cookie: Cookie;
  removeCookie: (cookieName: string) => Promise<void>;
  onEdit: (cookie: Cookie) => void;
}

export const CookiesTableRow: FC<CookiesTableRowProps> = ({ cookie, removeCookie, onEdit }) => {
  const t = useTranslation('cookies_table');
  const { editorEnabled } = useCookieEditors();

  const handleRemove = useCallback(
    () => void removeCookie(cookie.name),
    [removeCookie, cookie.name],
  );

  const handleEdit = useCallback(
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
            onClick={handleEdit}
            icon={IconPencil}
          />
        )}
        <IconButton
          label={t('delete_cookie')}
          onClick={handleRemove}
          icon={IconTrash}
          color="red"
        />
      </ActionsCell>
    </Table.Tr>
  );
};
