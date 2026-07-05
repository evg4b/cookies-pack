import { FC } from 'react';
import { Table } from '@mantine/core';

export interface CookiesTableProps {
  rows: never[];
}

export const CookiesTable: FC<CookiesTableProps> = props => (
  <Table>
    {JSON.stringify(props)}
  </Table>
);