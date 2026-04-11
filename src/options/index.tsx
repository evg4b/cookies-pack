import React from 'react';
import Options from '@src/options/Options';
import { createRoot } from 'react-dom/client';
import '../styles.css';

createRoot(document.body).render(
  <React.StrictMode>
    <Options/>
  </React.StrictMode>,
);
