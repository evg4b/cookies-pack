import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from '@pages/options/Options';
import { ThemeProvider } from '@shared/components';
import { PageContext } from '@shared/hooks/page';
import '../../styles.css';

createRoot(document.body).render(
  <PageContext.Provider value={ { document } }>
    <ThemeProvider>
      <Options/>
    </ThemeProvider>
  </PageContext.Provider>,
);
