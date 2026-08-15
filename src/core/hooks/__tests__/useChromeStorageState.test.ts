import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import  { type useChromeStorageState as UseChromeStorageStateFn } from '../useChromeStorageState';
import { type ChromeStorageMock, createChromeStorageMock } from '@src/test/chromeStorageMock';

const loadHookModule = async (): Promise<{ useChromeStorageState: typeof UseChromeStorageStateFn }> => {
  vi.resetModules();
  return import('../useChromeStorageState');
};

describe('useChromeStorageState', () => {
  let mockChrome: ChromeStorageMock;

  beforeEach(() => {
    mockChrome = createChromeStorageMock();
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

    const [state] = result.current;
    expect(state).toBe(false);
  });

  it('updates to the persisted value once storage.sync.get resolves', async () => {
    const uniqueKey = 'test-key-persisted';
    mockChrome.data[uniqueKey] = true;

    const { useChromeStorageState } = await loadHookModule();
    const { result } = renderHook(() => useChromeStorageState(uniqueKey, false));

    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe(true);
    });
  });

  it('persists a new value via chrome.storage.sync.set and updates state immediately', async () => {
    const uniqueKey = 'test-key-set';

    const { useChromeStorageState } = await loadHookModule();
    const { result } = renderHook(() => useChromeStorageState(uniqueKey, false));
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe(false);
    });

    act(() => {
      const [, setValue] = result.current;
      setValue(true);
    });

    const [newState] = result.current;
    expect(newState).toBe(true);
    expect(mockChrome.api.storage.sync.set).toHaveBeenCalledWith({ [uniqueKey]: true });
  });

  it('reacts to external storage changes for the same key', async () => {
    const uniqueKey = 'test-key-external-change';

    const { useChromeStorageState } = await loadHookModule();
    const { result } = renderHook(() => useChromeStorageState(uniqueKey, false));
    await waitFor(() => {
      const [state] = result.current;
      expect(state).toBe(false);
    });

    act(() => {
      mockChrome.emitChange(uniqueKey, true);
    });

    const [newState] = result.current;
    expect(newState).toBe(true);
  });

  it('shares state between two hook instances using the same key', async () => {
    const uniqueKey = 'test-key-shared';

    const { useChromeStorageState } = await loadHookModule();
    const first = renderHook(() => useChromeStorageState(uniqueKey, false));
    const second = renderHook(() => useChromeStorageState(uniqueKey, false));

    await waitFor(() => {
      const [firstState] = second.result.current;
      expect(firstState).toBe(false);
    });
    await waitFor(() => {
      const [secondState] = first.result.current;
      expect(secondState).toBe(false);
    });

    act(() => {
      const [, setValue] = first.result.current;
      setValue(true);
    });

    const [newState] = second.result.current;
    expect(newState).toBe(true);
  });
});
