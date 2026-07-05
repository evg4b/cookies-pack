import { FC } from 'react';
import { Table } from '@mantine/core';

export interface CookiesTableProps {
  cookies: chrome.cookies.Cookie[];
}

export const CookiesTable: FC<CookiesTableProps> = ({ cookies }) => {
  // const t = useTranslation();

  const rows = cookies.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.domain ?? 'N/A'}</Table.Td>
      <Table.Td>{element.name ?? 'N/A'}</Table.Td>
      <Table.Td>{element.path ?? 'N/A'}</Table.Td>
      <Table.Td>{element.value ?? 'N/A'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Domain</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Path</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
