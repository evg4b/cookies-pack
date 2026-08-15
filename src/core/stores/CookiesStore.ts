import { BaseStore } from '@core/stores/BaseStore';

export interface CookiesState {
  cookies: Cookie[];
  url: URL | null;
  loading: boolean;
  error: Error | null;
}

export interface SetCookieDetails extends Omit<chrome.cookies.SetDetails, 'url'> {
  url?: string;
}

export class CookiesStore extends BaseStore<CookiesState> {
  protected state: CookiesState = {
    cookies: [],
    url: null,
    loading: true,
    error: null,
  };

  constructor() {
    super();
    chrome.cookies.onChanged.addListener(() => {
      void this.handleCookiesChanged();
    });
    chrome.tabs.onActivated.addListener(() => {
      void this.refresh();
    });
    chrome.tabs.onUpdated.addListener((_: number, changeInfo: chrome.tabs.OnUpdatedInfo): void => {
      if (changeInfo.url) {
        void this.refresh();
      }
    });

    this.loadCookies().catch((error: unknown) => {
      console.error('Initial cookie load failed:', error);
    });
  }

  public async setCookie(name: string, value: string, details?: SetCookieDetails): Promise<Cookie | null> {
    try {
      const url = details?.url ?? (await this.getActiveTabUrl());
      if (!url) {
        throw new Error('Cannot set cookie without a valid URL');
      }

      await chrome.cookies.set({
        ...details,
        url: url.toString(),
        name,
        value,
      });
      await this.loadCookies();
      return this.state.cookies.find((c) => c.name === name) ?? null;
    } catch (error) {
      console.error('Failed to set cookie:', error);
      this.setState({ error: error instanceof Error ? error : new Error(String(error)) });
      return null;
    }
  }

  public async removeCookie(name: string, url?: string): Promise<void> {
    try {
      const targetUrl = url ?? (await this.getActiveTabUrl());
      if (!targetUrl) {
        throw new Error('Cannot remove cookie without a valid URL');
      }

      await chrome.cookies.remove({ url: targetUrl.toString(), name });
      await this.loadCookies();
    } catch (error) {
      console.error('Failed to remove cookie:', error);
      this.setState({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  }

  public async removeAllCookies(): Promise<void> {
    try {
      const url = await this.getActiveTabUrl();
      if (!url) {
        throw new Error('Cannot remove cookies without a valid URL');
      }

      const cookiesToRemove = [...this.state.cookies];
      await Promise.all(cookiesToRemove.map((cookie) => chrome.cookies.remove({
        url: url.toString(),
        name: cookie.name,
      })));
      this.setState({ cookies: [], error: null });
    } catch (error) {
      console.error('Failed to remove all cookies:', error);
      this.setState({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  }

  public getCookie(name: string): Cookie | undefined {
    return this.state.cookies.find((c) => c.name === name);
  }

  public refresh(): Promise<void> {
    return this.loadCookies();
  }

  private async loadCookies(): Promise<void> {
    this.setState({ loading: true });
    try {
      const url = await this.getActiveTabUrl();
      const cookies = url ? await chrome.cookies.getAll({ url: url.toString() }) : [];
      this.setState({ cookies, url, error: null, loading: false });
    } catch (error) {
      console.error('Failed to load cookies:', error);
      this.setState({
        cookies: [],
        url: null,
        error: error instanceof Error ? error : new Error(String(error)),
        loading: false,
      });
    }
  }

  private async getActiveTabUrl(): Promise<URL | null> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab.url ? new URL(tab.url) : null;
    } catch (error) {
      console.error('Failed to get active tab URL:', error);
      return null;
    }
  }

  private async handleCookiesChanged(): Promise<void> {
    try {
      const url = await this.getActiveTabUrl();
      const cookies = url ? await chrome.cookies.getAll({ url: url.toString() }) : [];
      this.setState({ cookies, url, error: null });
    } catch (error) {
      console.error('Failed to handle cookie change:', error);
      this.setState({ error: error instanceof Error ? error : new Error(String(error)) });
    }
  }
}