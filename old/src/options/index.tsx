import { translations } from '../core/translations';
import Options from './Options';
import i18n from 'i18next';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import '../styles.css';

await i18n.use(initReactI18next)
  .init({
    resources: translations,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

createRoot(document.body).render(
  <React.StrictMode>
    <Options/>
  </React.StrictMode>,
);
