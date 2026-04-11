import { useClearExistingCookiesFirst, useCustomPath } from '@shared/hooks';
import { Description, Label, Switch } from '@heroui/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const Options: FC = () => {
  const { t } = useTranslation();
  const [clearFirst, setClearFirst] = useClearExistingCookiesFirst();
  const [customPath, setCustomPath] = useCustomPath();

  return (
    <div className="bg-background text-foreground p-6">
      <div className="flex flex-col gap-6 max-w-sm">
        <div className="flex flex-col gap-4">
          <Switch isSelected={clearFirst} onChange={setClearFirst}>
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">{t('clear_first.label')}</Label>
              <Description className="text-xs">
                {t('clear_first.description')}
              </Description>
            </Switch.Content>
          </Switch>
          <Switch isSelected={customPath} onChange={setCustomPath}>
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">{t('custom_path.label')}</Label>
              <Description className="text-xs">
                {t('custom_path.description')}
              </Description>
            </Switch.Content>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Options;
