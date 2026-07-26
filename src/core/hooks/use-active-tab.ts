import { useSyncExternalStore } from 'react';
import { ActiveTabState, createActiveTabStore } from '@core/stores/active-tab-store';

const store = createActiveTabStore();

export interface UseActiveTabReturn extends ActiveTabState {
  refresh: () => void;
}

export function useActiveTab(): UseActiveTabReturn {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return { ...state, refresh: store.refresh };
}
