import CookiesTableCell from '@core/CookiesTableCell';
import CopyButton from '@core/CopyButton';
import DeleteButton from '@core/DeleteButton';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import type { TableProps } from '@nextui-org/table/dist/table';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface CookiesTableProps {
  cookies: Cookie[];
  copyToClipboard(value: string | Cookie[]): void;
  deleteCookie(cookie: Cookie): void;
}

const tableProps: TableProps = {
  layout: 'fixed',
  removeWrapper: true,
  isCompact: true,
  isHeaderSticky: true,
  classNames: {
    base: 'table-height overflow-scroll',
  },
};

export const CookiesTable: FC<CookiesTableProps> = ({ cookies, copyToClipboard, deleteCookie }) => {
  const { t } = useTranslation(['cookies_table']);
  const copyAll = useCallback(() => copyToClipboard(cookies), [cookies, copyToClipboard]);

  return (
    <Table { ...tableProps } aria-label={ t('aria_label') }>
      <TableHeader>
        <TableColumn key="name" width="25%">{ t('columns.name') }</TableColumn>
        <TableColumn key="path" width="13%">{ t('columns.path') }</TableColumn>
        <TableColumn key="value" width="55%">{ t('columns.value') }</TableColumn>
        <TableColumn key="action" width="8%">
          <CopyButton title={ t("copy_all_cookies") } onClick={ copyAll }/>
        </TableColumn>
      </TableHeader>
      <TableBody items={ cookies } emptyContent={ t('no_cookies') }>
        { (item) =>
          <TableRow key={ item.name }>
            <TableCell>
              <CookiesTableCell value={ item.name }/>
            </TableCell>
            <TableCell>
              <CookiesTableCell value={ item.path }/>
            </TableCell>
            <TableCell>
              <CookiesTableCell value={ item.value }/>
            </TableCell>
            <TableCell>
              <DeleteButton title={ t('delete_cookie') } onClick={ () => deleteCookie(item) }/>
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
};
