import { type Listener, type Unsubscribe } from '@core/stores/types';
import { useSyncExternalStore } from 'react';

interface StorageStore<T> {
  getSnapshot: () => T;
  subscribe: (listener: Listener) => Unsubscribe;
  setValue: (value: T) => void;
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

  const setValue = (value: T) => {
    state = value;
    notifyListeners();
    void chrome.storage.sync.set({ [key]: value });
  };

  return {
    getSnapshot: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    setValue,
  };
};

const getOrCreateStore = <T, >(key: string, defaultValue: T): StorageStore<T> => {
  const existing = stores.get(key);
  if (existing) {
    return existing as StorageStore<T>;
  }

  const store = createStorageStore(key, defaultValue);
  stores.set(key, store as StorageStore<unknown>);
  return store;
};

export type StateValue<T> = [T, (value: T) => void];

export const useChromeStorageState = <T, >(key: string, defaultValue: T): StateValue<T> => {
  const store = getOrCreateStore(key, defaultValue);
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return [value, store.setValue];
};