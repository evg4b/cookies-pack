import { useCallback, useSyncExternalStore } from 'react';

type Listener = () => void;

interface StorageStore<T> {
  getSnapshot: () => T;
  subscribe: (listener: Listener) => () => void;
  setValue: (value: T) => Promise<void>;
}

const stores = new Map<string, StorageStore<unknown>>();

const createStorageStore = <T, >(key: string, defaultValue: T): StorageStore<T> => {
  let state = defaultValue;
  const listeners = new Set<Listener>();

  const notifyListeners = () => {
    listeners.forEach((listener) => { listener(); });
  };

  chrome.storage.sync
    .get<Record<string, T>>(key)
    .then((result) => {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        state = result[key];
        notifyListeners();
      }
    })
    .catch((error: unknown) => {
      console.error(`Failed to read chrome.storage key "${key}":`, error);
    });

  chrome.storage.sync.onChanged.addListener((changes) => {
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      state = changes[key].newValue as T;
      notifyListeners();
    }
  });

  const setValue = async (value: T): Promise<void> => {
    state = value;
    notifyListeners();
    await chrome.storage.sync.set({ [key]: value });
  };

  return {
    getSnapshot: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setValue,
  };
};

const getStore = <T, >(key: string, defaultValue: T): StorageStore<T> => {
  const existing = stores.get(key);
  if (existing) {
    return existing as StorageStore<T>;
  }

  const store = createStorageStore(key, defaultValue);
  stores.set(key, store as StorageStore<unknown>);
  return store;
};

export const useChromeStorageState = <T, >(key: string, defaultValue: T): [T, (value: T) => Promise<void>] => {
  const store = getStore(key, defaultValue);
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const setValue = useCallback((next: T) => store.setValue(next), [store]);

  return [value, setValue];
};

export const useClearExistingCookiesFirst = (): [boolean, (value: boolean) => Promise<void>] =>
  useChromeStorageState('clearExistingCookiesFirst', true);

export const useCustomPath = (): [boolean, (value: boolean) => Promise<void>] =>
  useChromeStorageState('useCustomPath', false);

export type IconClickAction = 'popup' | 'sidepanel';

export const useIconClickAction = (): [IconClickAction, (value: IconClickAction) => Promise<void>] =>
  useChromeStorageState<IconClickAction>('iconClickAction', 'popup');

export type CookieEditorMode = 'bulk-editor-only' | 'editor-only' | 'both-editors';

export const useCookieEditorMode = (): [CookieEditorMode, (value: CookieEditorMode) => Promise<void>] =>
  useChromeStorageState<CookieEditorMode>('cookieEditorMode', 'both-editors');

export interface CookieEditors {
  bulkEditorEnabled: boolean;
  editorEnabled: boolean;
}
export const useCookieEditors = (): CookieEditors => {
  const [mode] = useCookieEditorMode();

  return {
    bulkEditorEnabled: mode === 'bulk-editor-only' || mode === 'both-editors',
    editorEnabled: mode === 'editor-only' || mode === 'both-editors',
  };
};