import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';

type StorageChangeListener = (changes: Record<string, chrome.storage.StorageChange>) => void;
type VoidListener = () => void;

const DEFAULT_POPUP = 'src/popup/index.html';

const createMockChrome = () => {
  const storageChangeListeners: StorageChangeListener[] = [];
  const installedListeners: VoidListener[] = [];
  const startupListeners: VoidListener[] = [];
  const data: Record<string, unknown> = {};

  const api = {
    runtime: {
      getManifest: vi.fn(() => ({ action: { default_popup: DEFAULT_POPUP } })),
      onInstalled: {
        addListener: (listener: VoidListener) => installedListeners.push(listener),
      },
      onStartup: {
        addListener: (listener: VoidListener) => startupListeners.push(listener),
      },
    },
    action: {
      setPopup: vi.fn().mockResolvedValue(undefined),
    },
    sidePanel: {
      setPanelBehavior: vi.fn().mockResolvedValue(undefined),
    },
    storage: {
      sync: {
        get: vi.fn((key: string) => Promise.resolve(key in data ? { [key]: data[key] } : {})),
        onChanged: {
          addListener: (listener: StorageChangeListener) => storageChangeListeners.push(listener),
        },
      },
    },
  };

  return {
    api,
    data,
    emitInstalled: () => { installedListeners.forEach((listener) => { listener(); }); },
    emitStartup: () => { startupListeners.forEach((listener) => { listener(); }); },
    emitStorageChange: (key: string, newValue: unknown) => {
      storageChangeListeners.forEach((listener) => { listener({ [key]: { newValue } }); });
    },
  };
};

const loadModule = async (): Promise<void> => {
  vi.resetModules();
  await import('../index');
};

describe('background', () => {
  let mockChrome: ReturnType<typeof createMockChrome>;

  beforeEach(() => {
    mockChrome = createMockChrome();
    vi.stubGlobal('chrome', mockChrome.api);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('applies the default popup and disables the side panel on install when nothing is stored', async () => {
    await loadModule();

    mockChrome.emitInstalled();

    await waitFor(() => {
      expect(mockChrome.api.action.setPopup).toHaveBeenCalledWith({ popup: DEFAULT_POPUP });
    });
    expect(mockChrome.api.sidePanel.setPanelBehavior).toHaveBeenCalledWith({ openPanelOnActionClick: false });
  });

  it('applies the side panel on startup when that preference was stored', async () => {
    mockChrome.data.iconClickAction = 'sidepanel';
    await loadModule();

    mockChrome.emitStartup();

    await waitFor(() => {
      expect(mockChrome.api.sidePanel.setPanelBehavior).toHaveBeenCalledWith({ openPanelOnActionClick: true });
    });
    expect(mockChrome.api.action.setPopup).toHaveBeenCalledWith({ popup: '' });
  });

  it('switches to the side panel when the stored preference changes', async () => {
    await loadModule();
    mockChrome.emitInstalled();
    await waitFor(() => {
      expect(mockChrome.api.action.setPopup).toHaveBeenCalledWith({ popup: DEFAULT_POPUP });
    });

    mockChrome.emitStorageChange('iconClickAction', 'sidepanel');

    await waitFor(() => {
      expect(mockChrome.api.sidePanel.setPanelBehavior).toHaveBeenCalledWith({ openPanelOnActionClick: true });
    });
    expect(mockChrome.api.action.setPopup).toHaveBeenCalledWith({ popup: '' });
  });

  it('ignores unrelated storage changes', async () => {
    await loadModule();
    mockChrome.emitInstalled();
    await waitFor(() => {
      expect(mockChrome.api.action.setPopup).toHaveBeenCalledTimes(1);
    });

    mockChrome.emitStorageChange('someOtherKey', 'value');

    expect(mockChrome.api.action.setPopup).toHaveBeenCalledTimes(1);
  });
});
