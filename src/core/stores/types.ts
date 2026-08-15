export type Tab = chrome.tabs.Tab;
export type Listener = () => void;
export type Unsubscribe = () => void;

export interface Store<T> {
  getSnapshot(): T;
  subscribe(listener: Listener): Unsubscribe;
  refresh(): Promise<void>;
}