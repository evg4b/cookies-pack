import { createContext, useContext } from 'react';
import { assertIsDefined } from '../helpres/assets';

export const ChromeContext = createContext(chrome);

export const useTabs = () => {
  const chrome = useContext(ChromeContext);
  assertIsDefined(chrome.cookies, 'There not access to tabs');

  return chrome.tabs;
};

export const useCookies = () => {
  const chrome = useContext(ChromeContext);
  assertIsDefined(chrome.cookies, 'There not access to cookies');

  return chrome.cookies;
};
