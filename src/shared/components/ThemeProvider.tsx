import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { NextUIProvider } from '@nextui-org/system';
import classNames from 'classnames';

const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dark, setDark] = useState(colorSchemeMedia.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);

    colorSchemeMedia.addEventListener('change', handler);

    return () => colorSchemeMedia.removeEventListener('change', handler);
  }, []);

  return (
    <NextUIProvider>
      <main className={classNames({ dark }, 'text-foreground', 'bg-background')}>
        { children }
      </main>
    </NextUIProvider>
  );
};
