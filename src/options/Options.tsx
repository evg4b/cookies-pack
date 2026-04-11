import { useSettings } from '@shared/hooks';
import { Label, Switch } from '@heroui/react';
import type { FC } from 'react';

const Options: FC = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="bg-background text-foreground p-6">
      <div className="flex flex-col gap-6 max-w-sm">
        <h1 className="text-base font-semibold">Default Settings</h1>
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
            </Switch.Content>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Options;
