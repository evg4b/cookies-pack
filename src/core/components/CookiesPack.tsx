import { FC } from 'react';
import { SupportingWrapper } from '@core/components/SupportingWrapper.tsx';
import { Flex } from '@mantine/core';
import { CookiesTable } from '@core/components/CookiesTable.tsx';
import { useCookies } from '@core/hooks/chrome.ts';

export const CookiesPack: FC = () => {
  const cookies = useCookies();
  console.log(cookies)


  return (
    <SupportingWrapper>
      <Flex flex={1} direction='column'>
        <CookiesTable cookies={cookies} />
      </Flex>
    </SupportingWrapper>
  );
};