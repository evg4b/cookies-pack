import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { ConfigProvider, MappingAlgorithm, theme } from 'antd';

const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
const defaultAlgorithm: MappingAlgorithm[] = colorSchemeMedia.matches ? [theme.darkAlgorithm] : [];

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [algorithms, setAlgorithm] = useState<MappingAlgorithm[]>(defaultAlgorithm);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setAlgorithm(e.matches ? [theme.darkAlgorithm] : []);

    colorSchemeMedia.addEventListener('change', handler);

    return () => colorSchemeMedia.removeEventListener('change', handler);
  }, []);

  return (
    <ConfigProvider theme={ { algorithm: algorithms } }>
      { children }
    </ConfigProvider>
  );
};
