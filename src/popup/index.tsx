import { ThemeProvider } from '@shared/components';
import Popup from '@src/popup/Popup';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';

createRoot(document.body).render(
  <React.StrictMode>
    <ThemeProvider>
      <Popup/>
    </ThemeProvider>
  </React.StrictMode>,
);
