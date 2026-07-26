import { DataList, Flex } from '@mantine/core';
import { HttpOnlyChip } from '@core/components/CookieEditor/HttpOnlyChip.tsx';
import { FC } from 'react';
import { SessionChip } from '@core/components/CookieEditor/SessionChip.tsx';
import { SecureChip } from '@core/components/CookieEditor/SecureChip.tsx';

export const CookieTooltip: FC<{ cookie: chrome.cookies.Cookie }> = ({ cookie }) => (
  <DataList>
    <DataList.Item>
      <DataList.ItemLabel>Name</DataList.ItemLabel>
      <DataList.ItemValue>{cookie.name}</DataList.ItemValue>
    </DataList.Item>
    <DataList.Item>
      <DataList.ItemLabel>Path</DataList.ItemLabel>
      <DataList.ItemValue>{cookie.path}</DataList.ItemValue>
    </DataList.Item>
    <DataList.Item>
      <DataList.ItemLabel>Value</DataList.ItemLabel>
      <DataList.ItemValue>{cookie.value}</DataList.ItemValue>
    </DataList.Item>
    <DataList.Item>
      <DataList.ItemLabel>Domain</DataList.ItemLabel>
      <DataList.ItemValue>{cookie.domain}</DataList.ItemValue>
    </DataList.Item>
    <DataList.Item>
      <DataList.ItemLabel>Same Size</DataList.ItemLabel>
      <DataList.ItemValue>{cookie.sameSite}</DataList.ItemValue>
    </DataList.Item>
    {!cookie.session && (
      <DataList.Item>
        <DataList.ItemLabel>Expiration Date</DataList.ItemLabel>
        <DataList.ItemValue>{new Date(cookie.expirationDate ?? 0).toLocaleString()}</DataList.ItemValue>
      </DataList.Item>
    )}
    <DataList.Item>
      <Flex gap="xs">
        {cookie.httpOnly && (
          <HttpOnlyChip size="xs" defaultChecked/>
        )}
        {cookie.secure && (
          <SecureChip size="xs" defaultChecked/>
        )}
        {cookie.session && (
          <SessionChip size="xs" defaultChecked/>
        )}
      </Flex>
    </DataList.Item>
  </DataList>
);