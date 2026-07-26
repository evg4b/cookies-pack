import { type Listener, type Tab, type Unsubscribe } from './types';

export interface ActiveTabState {
  tab: Tab | null;
  url: string | null;
  loading: boolean;
  error: Error | null;
}

export const createActiveTabStore = () => {
  let state: ActiveTabState = {
    tab: null,
    url: null,
    loading: true,
    error: null,
  };
  const listeners = new Set<Listener>();

  const notifyListeners = () => {
    listeners.forEach((listener) => { listener(); });
  };

  const setState = (patch: Partial<ActiveTabState>) => {
    state = { ...state, ...patch };
    notifyListeners();
  };

  const loadActiveTab = async (): Promise<void> => {
    setState({ loading: true });
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      setState({ tab, url: tab.url ?? null, error: null, loading: false });
    } catch (error) {
      console.error('Failed to load the active tab:', error);
      setState({
        tab: null,
        url: null,
        error: error instanceof Error ? error : new Error(String(error)),
        loading: false,
      });
    }
  };

  chrome.tabs.onActivated.addListener(() => {
    void loadActiveTab();
  });
  chrome.tabs.onUpdated.addListener((_: number, changeInfo: chrome.tabs.OnUpdatedInfo): void => {
    if (changeInfo.url) {
      void loadActiveTab();
    }
  });

  loadActiveTab().catch((error: unknown) => {
    console.error('Initial active tab load failed:', error);
  });

  return {
    getSnapshot: (): ActiveTabState => state,
    subscribe: (listener: Listener): Unsubscribe => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    refresh: (): void => void loadActiveTab(),
  };
};
