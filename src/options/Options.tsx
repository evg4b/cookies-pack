import { useSettings } from '@shared/hooks';
import { Description, Label, Switch } from '@heroui/react';
import type { FC } from 'react';

const Options: FC = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="bg-background text-foreground p-6">
      <div className="flex flex-col gap-6 max-w-sm">
        <div className="flex flex-col gap-4">
          <Switch
            isSelected={settings.clearExistingCookiesFirst}
            onChange={(val) => updateSetting('clearExistingCookiesFirst', val)}
          >
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">Clear existing cookies first</Label>
              <Description className="text-xs">
                When enabled, all cookies for the current site are removed before the new ones are applied.
              </Description>
            </Switch.Content>
          </Switch>
          <Switch
            isSelected={settings.useCustomPath}
            onChange={(val) => updateSetting('useCustomPath', val)}
          >
            <Switch.Control>
              <Switch.Thumb/>
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">Use custom path by default</Label>
              <Description className="text-xs">
                When enabled, the path from the current page URL is pre-filled instead of using&nbsp;
                <code>/</code>.
              </Description>
            </Switch.Content>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Options;
