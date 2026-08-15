import { useSyncExternalStore } from 'react';
import { Store } from '@core/stores/types';
import { ActiveTabState, ActiveTabStore } from '@core/stores/ActiveTabStore';

const store: Store<ActiveTabState> = new ActiveTabStore();

export interface UseActiveTabReturn extends ActiveTabState {
  refresh: () => Promise<void>;
}

export const useActiveTab = (): UseActiveTabReturn => {
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store),
  );

  return { ...state, refresh: store.refresh.bind(store) };
};
