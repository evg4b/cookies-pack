import { useEffect, useState } from 'react';

export interface Settings {
  clearExistingCookiesFirst: boolean;
  useCustomPath: boolean;
}

const defaultSettings: Settings = {
  clearExistingCookiesFirst: true,
  useCustomPath: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    chrome.storage.local.get(defaultSettings, (result) => {
      setSettings(result as Settings);
    });
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      chrome.storage.local.set({ [key]: value });
      return next;
    });
  };

  return { settings, updateSetting };
};
