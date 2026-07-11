import { MantineProvider } from '@mantine/core';
import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { cookiesPackTheme } from './theme.ts';

export type CookiesPackThemeProviderProps = PropsWithChildren & CookiesPackThemeContext;

type Mode = 'popup' | 'sidebar';

interface CookiesPackThemeContext {
  mode: Mode;
}

const CookiesPackContext = createContext<CookiesPackThemeContext>({
  mode: 'popup',
});

export const useCookiesPack = () => useContext(CookiesPackContext);

export function useModeValue<T>(values: Record<Mode, () => T>) {
  const { mode } = useCookiesPack();

  return useMemo(() => values[mode](), [mode, values]);
}

export const CookiesPackThemeProvider: FC<CookiesPackThemeProviderProps> = ({ children, mode }) => {
  return (
    <CookiesPackContext.Provider value={{ mode }}>
      <MantineProvider defaultColorScheme="auto" theme={cookiesPackTheme}>
        {children}
      </MantineProvider>
    </CookiesPackContext.Provider>
  );
};



