import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesPackThemeProvider } from '@src/core/theme/provider.tsx';
import { CookiesPack } from '@core/components/CookiesPack.tsx';

import '@mantine/core/styles.css';
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesPackThemeProvider>
      <CookiesPack/>
    </CookiesPackThemeProvider>
  </StrictMode>,
)
