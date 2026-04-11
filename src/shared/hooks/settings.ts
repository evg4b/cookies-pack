import { useEffect, useRef, useState } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (result) => {
      setSettings(result as Settings);
      setLoading(false);
    });
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    chrome.storage.sync.set({ [key]: value });
  };

  return { settings, loading, updateSetting };
};
