import { type FC } from 'react';
import { Container, Group, Radio, Stack, Text } from '@mantine/core';
import { useCookieEditorMode, useIconClickAction, useTranslation } from '@core/hooks';

type CardOption<T> = { value: T, label: string, description: string };

const iconActions: CardOption<string>[] = [
  {
    value: 'popup',
    label: 'icon_click_action_popup',
    description: 'icon_click_action_popup_description',
  },
  {
    value: 'sidepanel',
    label: 'icon_click_action_sidepanel',
    description: 'icon_click_action_sidepanel_description',
  },
];

const editorModes: CardOption<string>[] = [
  {
    value: 'bulk-editor-only',
    label: 'editor_mode_bulk_editor_only',
    description: 'editor_mode_bulk_editor_only_description',
  },
  {
    value: 'editor-only',
    label: 'editor_mode_editor_only',
    description: 'editor_mode_editor_only_description',
  },
  {
    value: 'both-editors',
    label: 'editor_mode_both_editors',
    description: 'editor_mode_both_editors_description',
  },
];

export const OptionsPage: FC = () => {
  const t = useTranslation('options');
  const [iconClickAction, setIconClickAction] = useIconClickAction();
  const [cookieEditorMode, setCookieEditorMode] = useCookieEditorMode();

  return (
    <Container size="sm" py="sm">
      <Stack gap="xs">
        <Radio.Group label={t('icon_click_action_label')} value={iconClickAction} onChange={setIconClickAction}>
          <Stack gap="xs" mt="xs">
            {iconActions.map(mode => (
              <Radio.Card value={mode.value} aria-label={t(mode.label)}>
                <Group wrap="nowrap" align="flex-start" gap="sm">
                  <Radio.Indicator/>
                  <Stack gap={2}>
                    <Text>{t(mode.label)}</Text>
                    <Text size="xs" c="dimmed">
                      {t(mode.description)}
                    </Text>
                  </Stack>
                </Group>
              </Radio.Card>
            ))}
          </Stack>
        </Radio.Group>
        <Radio.Group label={t('editor_mode_label')} value={cookieEditorMode} onChange={setCookieEditorMode}>
          <Stack gap="xs" mt="xs">
            {editorModes.map(mode => (
              <Radio.Card value={mode.value} aria-label={t(mode.label)}>
                <Group wrap="nowrap" align="flex-start" gap="sm">
                  <Radio.Indicator/>
                  <Stack gap={2}>
                    <Text>{t(mode.label)}</Text>
                    <Text size="xs" c="dimmed">
                      {t(mode.description)}
                    </Text>
                  </Stack>
                </Group>
              </Radio.Card>
            ))}
          </Stack>
        </Radio.Group>
      </Stack>
    </Container>
  );
};
