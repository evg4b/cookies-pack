import  { type FC } from 'react';
import { Group, Radio, Stack, Text } from '@mantine/core';

export interface OptionCardProps {
  value: string;
  label: string;
  description: string;
}

export const OptionCard: FC<OptionCardProps> = ({ value, label, description }) => (
  <Radio.Card value={value} aria-label={label}>
    <Group wrap="nowrap" align="flex-start" gap="sm">
      <Radio.Indicator/>
      <Stack gap={2}>
        <Text>{label}</Text>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </Stack>
    </Group>
  </Radio.Card>
);