import { FC } from 'react';
import { EmptyState, Table, UnstyledButton } from '@mantine/core';
import { IconComponentsOff, IconCopy, IconDownload, IconPencil } from '@tabler/icons-react';
import { useCookies } from '@core/hooks';

export interface CookiesTableProps {
  // cookies: chrome.cookies.Cookie[];
}

export const CookiesTable: FC<CookiesTableProps> = ({}) => {
  const cookies = useCookies();
  // const t = useTranslation();

  if (!cookies.length) {
    return (
      <EmptyState
        icon={<IconComponentsOff/>}
        title="No cookies found"
        description="There are no cookies available for the current site."
      />
    );
  }

  const rows = cookies.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name ?? 'N/A'}</Table.Td>
      <Table.Td>{element.path ?? 'N/A'}</Table.Td>
      <Table.Td style={{ overflow: 'hidden' }}>
        <div style={{ maxWidth: '10px' }}>
          {element.value ?? 'N/A'}
        </div>
      </Table.Td>
      <Table.Th>
        <IconPencil style={{ cursor: 'pointer' }} size={16}/>
      </Table.Th>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={500} maxHeight="100%">
      <Table striped stickyHeader width="100%">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Path</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>
              <UnstyledButton>
                <IconCopy size={16}/>
              </UnstyledButton>
              <UnstyledButton>
                <IconDownload size={16}/>
              </UnstyledButton>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
