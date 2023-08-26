import { CookiesTableCell } from '@core/CookiesTableCell';
import { CopyButton } from '@core/CopyButton';
import { DeleteButton } from '@core/DeleteButton';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import type { TableProps } from '@nextui-org/table/dist/table';
import type { FC } from 'react';
import React, { useCallback } from 'react';

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
  'aria-label': "Current site cookies",
};

export const CookiesTable: FC<CookiesTableProps> = ({ cookies, copyToClipboard, deleteCookie }) => {
  const copyAll = useCallback(() => copyToClipboard(cookies), [cookies, copyToClipboard]);

  return (
    <Table { ...tableProps }>
      <TableHeader>
        <TableColumn key="name" width="25%">Name</TableColumn>
        <TableColumn key="path" width="13%">Path</TableColumn>
        <TableColumn key="value" width="55%">Value</TableColumn>
        <TableColumn key="action" width="8%">
          <CopyButton title="Copy all cookies." onClick={ copyAll }/>
        </TableColumn>
      </TableHeader>
      <TableBody items={ cookies } emptyContent={ 'No cookies.' }>
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
              <DeleteButton title="Delete cookie" onClick={() => deleteCookie(item) }/>
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
};
