import { translations } from '@core/translations';
import { ThemeProvider } from '@shared/components';
import Popup from '@src/popup/Popup';
import i18n from "i18next";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from "react-i18next";
import '../styles.css';

i18n.use(initReactI18next)
  .init({
    resources: translations,
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

createRoot(document.body).render(
  <React.StrictMode>
    <ThemeProvider>
      <Popup/>
    </ThemeProvider>
  </React.StrictMode>,
);
