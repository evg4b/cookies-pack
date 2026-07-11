import { FC } from 'react';
import { Container, Paper, Radio, Stack, Text, Title } from '@mantine/core';
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
                <Radio value="popup" label={t('icon_click_action_popup')}/>
                <Radio value="sidepanel" label={t('icon_click_action_sidepanel')}/>
              </Stack>
            </Radio.Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
