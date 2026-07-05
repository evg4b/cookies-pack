import { FC } from 'react';
import { EmptyState, Flex, Table, UnstyledButton } from '@mantine/core';
import { IconComponentsOff, IconCopy, IconDownload, IconPencil } from '@tabler/icons-react';
import { useCookies, useTranslation } from '@core/hooks';

export interface CookiesTableProps {
  // cookies: chrome.cookies.Cookie[];
}

export const CookiesTable: FC<CookiesTableProps> = ({}) => {
  const { cookies } = useCookies();
  const t = useTranslation('cookies_table');

  if (!cookies.length) {
    return (
      <EmptyState
        icon={<IconComponentsOff/>}
        title={t('empty_title')}
        description={t('empty_description')}
      />
    );
  }

  const rows = cookies.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name ?? 'N/A'}</Table.Td>
      <Table.Td>{element.path ?? 'N/A'}</Table.Td>
      <Table.Td style={{ maxWidth: '390px' }}>
        <Flex style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {element.value ?? 'N/A'}
        </Flex>
      </Table.Td>
      <Table.Td width="10%">
        <IconPencil style={{ cursor: 'pointer' }} size={16}/>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={10}>
      <Table striped stickyHeader width="100%">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Path</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>
              <Flex style={{ width: '10px', background: 'red' }} gap="xs" direction="row" justify="flex-end"
                    align="anchor-center">
                <UnstyledButton style={{ background: 'yellow' }}>
                  <IconCopy size={16}/>
                </UnstyledButton>
                <UnstyledButton style={{ background: 'blue' }}>
                  <IconDownload size={16}/>
                </UnstyledButton>
              </Flex>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
