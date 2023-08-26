import { NextUIProvider } from '@nextui-org/system';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';

const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dark, setDark] = useState(colorSchemeMedia.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);

    colorSchemeMedia.addEventListener('change', handler);

    return () => colorSchemeMedia.removeEventListener('change', handler);
  }, []);

  const themeMapping: Record<string, boolean> = {
    'cookies-pack-light': !dark,
    'cookies-pack-dark': dark,
  };

  return (
    <NextUIProvider>
      <main className={ classNames(themeMapping, 'text-foreground', 'bg-background') }>
        { children }
      </main>
    </NextUIProvider>
  );
};
