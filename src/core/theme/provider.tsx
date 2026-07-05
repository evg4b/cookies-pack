import { MantineProvider } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import { cookiesPackTheme } from './theme.ts';

export const CookiesPackThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider defaultColorScheme="auto" theme={cookiesPackTheme}>
      {children}
    </MantineProvider>
  );
};