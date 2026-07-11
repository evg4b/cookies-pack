import { FC } from 'react';
import { Container, Group, Paper, Radio, Stack, Text, Title } from '@mantine/core';
import { IconClickAction, useIconClickAction, useTranslation } from '@core/hooks';

export const OptionsPage: FC = () => {
  const t = useTranslation('options');
  const [iconClickAction, setIconClickAction] = useIconClickAction();

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Title order={2}>{t('title')}</Title>
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Text fw={500}>{t('icon_click_action_label')}</Text>
            <Text size="sm" c="dimmed">{t('icon_click_action_description')}</Text>
            <Radio.Group
              value={iconClickAction}
              onChange={(value) => void setIconClickAction(value as IconClickAction)}
            >
              <Stack gap="xs" mt="xs">
                <Radio.Card value="popup" p="sm" radius="md">
                  <Group wrap="nowrap" gap="sm">
                    <Radio.Indicator/>
                    <Text>{t('icon_click_action_popup')}</Text>
                  </Group>
                </Radio.Card>
                <Radio.Card value="sidepanel" p="sm" radius="md">
                  <Group wrap="nowrap" gap="sm">
                    <Radio.Indicator/>
                    <Text>{t('icon_click_action_sidepanel')}</Text>
                  </Group>
                </Radio.Card>
              </Stack>
            </Radio.Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
