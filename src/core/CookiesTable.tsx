import React, { FC, useCallback } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react';
import { CopyButton } from '@core/CopyButton';
import { CookiesTableCell } from '@core/CookiesTableCell';

export interface CookiesTableProps {
  cookies: Cookie[];
  current: string;
}

export const CookiesTable: FC<CookiesTableProps> = ({ cookies, current }) => {
  const toClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(current);
  }, [current]);

  return (
    <Table layout="fixed" removeWrapper fullWidth={ false } isCompact isHeaderSticky
           classNames={ { base: "table-height overflow-scroll" } }>
      <TableHeader>
        <TableColumn key="name" width="30%">Name</TableColumn>
        <TableColumn key="value" width="70%">
          <div className="flex flex-row justify-between items-center">
            <span>Value</span>
            <CopyButton title="Copy all cookies." onClick={ toClipboard }/>
          </div>
        </TableColumn>
      </TableHeader>
      <TableBody items={ cookies } emptyContent={ "No cookies." }>
        { (item) => (
          <TableRow key={ item.name }>
            <TableCell>
              <CookiesTableCell value={ item.name }/>
            </TableCell>
            <TableCell>
              <CookiesTableCell value={ item.value }/>
            </TableCell>
          </TableRow>
        ) }
      </TableBody>
    </Table>
  );
};
