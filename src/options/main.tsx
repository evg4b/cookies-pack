import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesPackThemeProvider } from '@core/theme';
import { OptionsPage } from '@core/components';

import '@mantine/core/styles.css';
import './index.css';

createRoot(document.body).render(
  <StrictMode>
    <CookiesPackThemeProvider mode="popup">
      <OptionsPage/>
    </CookiesPackThemeProvider>
  </StrictMode>,
);
