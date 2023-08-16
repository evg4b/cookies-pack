import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { ConfigProvider, Layout, MappingAlgorithm, theme } from 'antd';

const media = window.matchMedia('(prefers-color-scheme: dark)');
const data: MappingAlgorithm[] = media.matches ? [theme.darkAlgorithm] : [];

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [algorithms, setAlgorithm] = useState<MappingAlgorithm[]>(data);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setAlgorithm(e.matches ? [theme.darkAlgorithm] : []);

    media.addEventListener('change', handler);

    return () => media.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    console.log(algorithms);
  }, [algorithms]);

  return (
    <ConfigProvider theme={ { algorithm: algorithms } }>
      <Layout>
        { children }
      </Layout>
    </ConfigProvider>
  );
};
