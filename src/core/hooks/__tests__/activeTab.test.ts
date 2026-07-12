import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { useActiveTab as UseActiveTabFn } from '../activeTab';

type Listener = () => void;
type TabUpdatedListener = (tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo) => void;

const createMockChrome = () => {
  const tabActivatedListeners: Listener[] = [];
  const tabUpdatedListeners: TabUpdatedListener[] = [];

  const api = {
    tabs: {
      query: vi.fn(),
      onActivated: {
        addListener: (cb: Listener) => tabActivatedListeners.push(cb),
      },
      onUpdated: {
        addListener: (cb: TabUpdatedListener) => tabUpdatedListeners.push(cb),
      },
    },
  };

  return {
    api,
    emitTabActivated: () => {
      tabActivatedListeners.forEach((l) => { l(); });
    },
    emitTabUpdated: (tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo) => {
      tabUpdatedListeners.forEach((l) => { l(tabId, changeInfo); });
    },
  };
};

const ACTIVE_TAB_URL = 'https://example.com/page';

const withActiveTab = (mockChrome: ReturnType<typeof createMockChrome>, url: string | null = ACTIVE_TAB_URL) => {
  mockChrome.api.tabs.query.mockResolvedValue(url ? [{ url }] : []);
};

const loadHookModule = async (): Promise<{ useActiveTab: typeof UseActiveTabFn }> => {
  vi.resetModules();
  return import('../activeTab');
};

describe('useActiveTab', () => {
  let mockChrome: ReturnType<typeof createMockChrome>;
  let consoleErrorSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    mockChrome = createMockChrome();
    vi.stubGlobal('chrome', mockChrome.api);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
  });

  it('loads the active tab on mount', async () => {
    withActiveTab(mockChrome);

    const { useActiveTab } = await loadHookModule();
    const { result } = renderHook(() => useActiveTab());

    await waitFor(() => { expect(result.current.loading).toBe(false); });

    expect(result.current.tab).toEqual({ url: ACTIVE_TAB_URL });
    expect(result.current.url).toBe(ACTIVE_TAB_URL);
    expect(result.current.error).toBeNull();
    expect(mockChrome.api.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true });
  });

  it('resolves to a null tab and url when there is no active tab', async () => {
    withActiveTab(mockChrome, null);

    const { useActiveTab } = await loadHookModule();
    const { result } = renderHook(() => useActiveTab());

    await waitFor(() => { expect(result.current.loading).toBe(false); });

    expect(result.current.tab).toBeNull();
    expect(result.current.url).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('captures an error when reading the active tab fails', async () => {
    mockChrome.api.tabs.query.mockRejectedValue(new Error('Permission denied'));

    const { useActiveTab } = await loadHookModule();
    const { result } = renderHook(() => useActiveTab());

    await waitFor(() => { expect(result.current.loading).toBe(false); });

    expect(result.current.tab).toBeNull();
    expect(result.current.url).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Permission denied');
  });

  it('reloads the active tab on demand', async () => {
    withActiveTab(mockChrome, 'https://first.com');

    const { useActiveTab } = await loadHookModule();
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => { expect(result.current.loading).toBe(false); });
    expect(result.current.url).toBe('https://first.com');

    withActiveTab(mockChrome, 'https://second.com');
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.url).toBe('https://second.com');
  });

  it('reloads when chrome.tabs.onActivated fires', async () => {
    withActiveTab(mockChrome, 'https://first.com');

    const { useActiveTab } = await loadHookModule();
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => { expect(result.current.loading).toBe(false); });

    withActiveTab(mockChrome, 'https://second.com');
    act(() => {
      mockChrome.emitTabActivated();
    });

    await waitFor(() => { expect(result.current.url).toBe('https://second.com'); });
  });

  it('reloads only when a tab update includes a URL change', async () => {
    withActiveTab(mockChrome);

    const { useActiveTab } = await loadHookModule();
    const { result } = renderHook(() => useActiveTab());
    await waitFor(() => { expect(result.current.loading).toBe(false); });

    const callsBeforeUpdate = mockChrome.api.tabs.query.mock.calls.length;

    act(() => {
      mockChrome.emitTabUpdated(1, {});
    });
    expect(mockChrome.api.tabs.query).toHaveBeenCalledTimes(callsBeforeUpdate);

    act(() => {
      mockChrome.emitTabUpdated(1, { url: 'https://new-url.com' });
    });
    await waitFor(() => {
      expect(mockChrome.api.tabs.query).toHaveBeenCalledTimes(callsBeforeUpdate + 1);
    });
  });
});
