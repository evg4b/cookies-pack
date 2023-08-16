import React, { FC } from 'react';
import { CookiesContainer } from '@core/cookies-tab';
import { ThemeProvider } from '@shared/components';
import { Space } from 'antd';

const Popup: FC = () => (
  <ThemeProvider>
    <Space styles={ { item: { width: '800px', height: '400px' } } }>
      <CookiesContainer/>
    </Space>
  </ThemeProvider>
);

export default Popup;
