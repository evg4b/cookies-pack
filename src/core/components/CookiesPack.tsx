import { FC } from 'react';
import { CookiesBatchUpdate, CookiesTable, SupportingWrapper } from '@core/components';
import { Flex } from '@mantine/core';

export const CookiesPack: FC = () => {
  return (
    <Flex direction="column" style={{ height: '100vh' }}>
      <SupportingWrapper>
        <Flex flex={3} direction="column" style={{ overflow: 'hidden' }}>
          <CookiesTable />
        </Flex>
        <Flex flex={1} direction="column">
          <CookiesBatchUpdate style={{ padding: '0.5em' }}/>
        </Flex>
      </SupportingWrapper>
    </Flex>
  );
};