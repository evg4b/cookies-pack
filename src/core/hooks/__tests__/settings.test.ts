import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { useChromeStorageState as UseChromeStorageStateFn } from '../settings';

type StorageChangeListener = (changes: Record<string, chrome.storage.StorageChange>) => void;

const createMockChrome = () => {
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

const loadHookModule = async (): Promise<{ useChromeStorageState: typeof UseChromeStorageStateFn }> => {
  vi.resetModules();
  return import('../settings');
};

describe('useChromeStorageState', () => {
  let mockChrome: ReturnType<typeof createMockChrome>;

  beforeEach(() => {
    mockChrome = createMockChrome();
    vi.stubGlobal('chrome', mockChrome.api);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('starts with the provided default before storage resolves', async () => {
    const uniqueKey = 'test-key-initial';

    const { useChromeStorageState } = await loadHookModule();
    const { result } = renderHook(() => useChromeStorageState(uniqueKey, false));

    expect(result.current[0]).toBe(false);
  });

  it('updates to the persisted value once storage.sync.get resolves', async () => {
    const uniqueKey = 'test-key-persisted';
    mockChrome.data[uniqueKey] = true;

    const { useChromeStorageState } = await loadHookModule();
    const { result } = renderHook(() => useChromeStorageState(uniqueKey, false));

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });
  });

  it('persists a new value via chrome.storage.sync.set and updates state immediately', async () => {
    const uniqueKey = 'test-key-set';

    const { useChromeStorageState } = await loadHookModule();
    const { result } = renderHook(() => useChromeStorageState(uniqueKey, false));
    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });

    await act(async () => {
      await result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(mockChrome.api.storage.sync.set).toHaveBeenCalledWith({ [uniqueKey]: true });
  });

  it('reacts to external storage changes for the same key', async () => {
    const uniqueKey = 'test-key-external-change';

    const { useChromeStorageState } = await loadHookModule();
    const { result } = renderHook(() => useChromeStorageState(uniqueKey, false));
    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });

    act(() => {
      mockChrome.emitChange(uniqueKey, true);
    });

    expect(result.current[0]).toBe(true);
  });

  it('shares state between two hook instances using the same key', async () => {
    const uniqueKey = 'test-key-shared';

    const { useChromeStorageState } = await loadHookModule();
    const first = renderHook(() => useChromeStorageState(uniqueKey, false));
    const second = renderHook(() => useChromeStorageState(uniqueKey, false));

    await waitFor(() => {
      expect(first.result.current[0]).toBe(false);
    });
    await waitFor(() => {
      expect(second.result.current[0]).toBe(false);
    });

    await act(async () => {
      await first.result.current[1](true);
    });

    expect(second.result.current[0]).toBe(true);
  });
});
