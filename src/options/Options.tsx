import { useSettings } from '@shared/hooks';
import { Label, Switch } from '@heroui/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const Options: FC = () => {
  const { t } = useTranslation();
  const { settings, loading, updateSetting } = useSettings();

  if (loading) return null;

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-md flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-semibold">{t('options.title')}</h1>
          <p className="text-sm text-muted mt-1">{t('options.description')}</p>
        </div>
        <div className="flex flex-col gap-4">
          <Switch
            isSelected={settings.clearExistingCookiesFirst}
            onChange={(value) => updateSetting('clearExistingCookiesFirst', value)}
          >
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">{t('clear_existing_cookies_first')}</Label>
            </Switch.Content>
          </Switch>
          <Switch
            isSelected={settings.useCustomPath}
            onChange={(value) => updateSetting('useCustomPath', value)}
          >
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">{t('use_custom_path')}</Label>
            </Switch.Content>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Options;
