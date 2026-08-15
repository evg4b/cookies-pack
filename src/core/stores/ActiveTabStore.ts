import { type Tab } from '@core/stores/types';
import { BaseStore } from '@core/stores/BaseStore';

export interface ActiveTabState {
  tab: Tab | null;
  url: string | null;
  loading: boolean;
  error: Error | null;
}

export class ActiveTabStore extends BaseStore<ActiveTabState> {
  protected state: ActiveTabState = {
    tab: null,
    url: null,
    loading: true,
    error: null,
  };

  constructor() {
    super();

    chrome.tabs.onActivated.addListener(() => {
      void this.loadActiveTab();
    });

    chrome.tabs.onUpdated.addListener((_, changeInfo): void => {
      if (changeInfo.url) {
        void this.loadActiveTab();
      }
    });

    this.loadActiveTab().catch((error: unknown) => {
      console.error('Initial active tab load failed:', error);
    });
  }

  public refresh(): Promise<void> {
    return this.loadActiveTab();
  }

  private async loadActiveTab(): Promise<void> {
    this.setState({ loading: true });
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.setState({ tab, url: tab.url ?? null, error: null, loading: false });
    } catch (error) {
      console.error('Failed to load the active tab:', error);
      this.setState({
        tab: null,
        url: null,
        error: error instanceof Error ? error : new Error(String(error)),
        loading: false,
      });
    }
  }
}
