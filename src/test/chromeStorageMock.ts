import { vi } from 'vitest';

type StorageChangeListener = (changes: Record<string, chrome.storage.StorageChange>) => void;

export const createChromeStorageMock = () => {
  const listeners: StorageChangeListener[] = [];
  const data: Record<string, unknown> = {};

  const api = {
    storage: {
      sync: {
        get: vi.fn((key: string) => Promise.resolve(key in data ? { [key]: data[key] } : {})),
        set: vi.fn((items: Record<string, unknown>) => {
          Object.assign(data, items);
          return Promise.resolve();
        }),
        onChanged: {
          addListener: (listener: StorageChangeListener) => {
            listeners.push(listener);
          },
        },
      },
    },
  };

  return {
    api,
    data,
    emitChange: (key: string, newValue: unknown) => {
      listeners.forEach((listener) => {
        listener({ [key]: { newValue } });
      });
    },
  };
};

export type ChromeStorageMock = ReturnType<typeof createChromeStorageMock>;
