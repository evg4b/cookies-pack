import type { FC, MouseEventHandler } from 'react';
import React from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import type { TableProps } from '@nextui-org/table/dist/table';
import { CopyButton } from '@core/CopyButton';
import { CookiesTableCell } from '@core/CookiesTableCell';

export interface CookiesTableProps {
  cookies: Cookie[];
  copyToClipboard: MouseEventHandler<HTMLButtonElement>;
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

export const CookiesTable: FC<CookiesTableProps> = ({ cookies, copyToClipboard }) => {
  return (
    <Table { ...tableProps }>
      <TableHeader>
        <TableColumn key="name" width="30%">Name</TableColumn>
        <TableColumn key="value" width="70%">
          <div className="flex flex-row justify-between items-center">
            <span>Value</span>
            <CopyButton title="Copy all cookies." onClick={ copyToClipboard }/>
          </div>
        </TableColumn>
      </TableHeader>
      <TableBody items={ cookies } emptyContent={ 'No cookies.' }>
        { (item) =>
          <TableRow key={ item.name }>
            <TableCell>
              <CookiesTableCell value={ item.name }/>
            </TableCell>
            <TableCell>
              <CookiesTableCell value={ item.value }/>
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
};
