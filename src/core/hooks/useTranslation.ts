type T = typeof chrome.i18n.getMessage;

export const useTranslation = (): T => {
  return chrome.i18n.getMessage;
};
