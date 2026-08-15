import { MantineProvider } from '@mantine/core';
import { createContext, type FC, type PropsWithChildren, useContext, useMemo } from 'react';
import { cookiesPackTheme } from './theme';

export type Mode = 'popup' | 'sidebar';

export interface CookiesPackThemeContextValue {
  mode: Mode;
}

export type CookiesPackThemeProviderProps = PropsWithChildren<CookiesPackThemeContextValue>;

const CookiesPackThemeContext = createContext<CookiesPackThemeContextValue>({
  mode: 'popup',
});

export const useCookiesPack = (): CookiesPackThemeContextValue => useContext(CookiesPackThemeContext);

export const useModeValue = <T, >(values: Record<Mode, () => T>): T => {
  const { mode } = useCookiesPack();

  return values[mode]();
};

export const CookiesPackThemeProvider: FC<CookiesPackThemeProviderProps> = ({ children, mode }) => {
  const contextValue = useMemo<CookiesPackThemeContextValue>(() => ({ mode }), [mode]);

  return (
    <CookiesPackThemeContext.Provider value={contextValue}>
      <MantineProvider defaultColorScheme="auto" theme={cookiesPackTheme}>
        {children}
      </MantineProvider>
    </CookiesPackThemeContext.Provider>
  );
};
