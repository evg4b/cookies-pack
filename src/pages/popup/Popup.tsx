import React, { FC } from 'react';
import { CookiesContainer } from '@core/cookies-tab';
import { Layout } from 'antd';

const Popup: FC = () => (
  <Layout>
    <CookiesContainer/>
  </Layout>
);

export default Popup;
