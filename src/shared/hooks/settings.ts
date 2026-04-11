import { useState } from 'react';

export interface Settings {
  clearExistingCookiesFirst: boolean;
  useCustomPath: boolean;
}

const STORAGE_KEY = 'cookies-pack-settings';

const defaultSettings: Settings = {
  clearExistingCookiesFirst: true,
  useCustomPath: false,
};

const load = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings;
};

const save = (settings: Settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(load);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      save(next);
      return next;
    });
  };

  return { settings, updateSetting };
};
