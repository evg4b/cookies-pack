import { Flex, Table } from '@mantine/core';
import { type FC, type PropsWithChildren } from 'react';

export type ActionsCellProps = PropsWithChildren<{
  Component?: typeof Table.Td | typeof Table.Th;
}>;

export const ActionsCell: FC<ActionsCellProps> = ({ Component = Table.Td, children }) => (
  <Component w={104}>
    <Flex gap="3px" direction="row" justify="flex-end" pr="xs" align="center" wrap="nowrap">
      {children}
    </Flex>
  </Component>
);
