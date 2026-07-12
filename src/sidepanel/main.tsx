import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesPackThemeProvider } from '@src/core/theme';
import { CookiesPack } from '@core/components';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';

createRoot(document.body).render(
  <StrictMode>
    <CookiesPackThemeProvider mode="sidebar">
      <CookiesPack/>
    </CookiesPackThemeProvider>
  </StrictMode>,
);
