import { Flex, Table } from '@mantine/core';
import { PropsWithChildren } from 'react';

export type ActionsCellProps = PropsWithChildren<{
  Component?: typeof Table.Td | typeof Table.Th;
}>;

export const ActionsCell = ({ Component, children }: ActionsCellProps) => {
  const TableElement = Component ?? Table.Td;

  return (
    <TableElement w={104}>
      <Flex gap="3px" direction="row" justify="flex-end" pr="xs" align="center" wrap="nowrap">
        {children}
      </Flex>
    </TableElement>
  );
};