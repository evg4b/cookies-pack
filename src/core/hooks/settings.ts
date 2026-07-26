import { type StateValue, useChromeStorageState } from '@core/stores/common-settings-store';

export const useClearExistingCookiesFirst = (): StateValue<boolean> =>
  useChromeStorageState('clearExistingCookiesFirst', true);

export const useCustomPath = (): StateValue<boolean> =>
  useChromeStorageState('useCustomPath', false);

export type IconClickAction = 'popup' | 'sidepanel';

export const useIconClickAction = (): StateValue<IconClickAction> =>
  useChromeStorageState<IconClickAction>('iconClickAction', 'popup');

export type CookieEditorMode = 'bulk-editor-only' | 'editor-only' | 'both-editors';

export const useCookieEditorMode = (): StateValue<CookieEditorMode> =>
  useChromeStorageState<CookieEditorMode>('cookieEditorMode', 'both-editors');

export interface CookieEditors {
  bulkEditorEnabled: boolean;
  editorEnabled: boolean;
}

export const useCookieEditors = (): CookieEditors => {
  const [mode] = useCookieEditorMode();

  return {
    bulkEditorEnabled: mode === 'bulk-editor-only' || mode === 'both-editors',
    editorEnabled: mode === 'editor-only' || mode === 'both-editors',
  };
};