import { FC, PropsWithChildren } from 'react';
import { EmptyState, Flex } from '@mantine/core';
import { useTranslation } from '@core/hooks';
import { IconMoodSad } from '@tabler/icons-react';

export const SupportingWrapper: FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslation();

  const supported = true;
  if (!supported) {
    return (
      <Flex flex={1} justify="center" align="center" style={{ userSelect: 'none' }}>
        <EmptyState
          withIndicatorBackground
          variant="light"
          title={t('not_supported_title')}
          description={t('not_supported_description')}
          icon={<IconMoodSad/>}
        />
      </Flex>
    );
  }

  return children;
};