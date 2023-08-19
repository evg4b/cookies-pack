import React from 'react';
import Popup from '@pages/popup/Popup';
import { createRoot } from 'react-dom/client';
import { PageContext } from '@shared/hooks/page';
import '../../styles.css';
import { ThemeProvider } from '@shared/components';

createRoot(document.body).render(
  <React.StrictMode>
    <PageContext.Provider value={ { document } }>
      <ThemeProvider>
        <Popup/>
      </ThemeProvider>
    </PageContext.Provider>
  </React.StrictMode>,
);
