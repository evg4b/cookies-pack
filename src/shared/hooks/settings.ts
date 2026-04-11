import { createChromeStorageStateHookLocal } from 'use-chrome-storage';

export const useClearExistingCookiesFirst = createChromeStorageStateHookLocal('clearExistingCookiesFirst', true);
export const useCustomPath = createChromeStorageStateHookLocal('useCustomPath', false);
