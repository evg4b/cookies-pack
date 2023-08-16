import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from '@pages/options/Options';
import { assertIsDefined } from '@shared/helpres/assets';
import { ThemeProvider } from '@shared/components';
import { PageContext } from '@shared/hooks/page';
import '../../styles.css';

const rootContainer = document.querySelector('#__root');
assertIsDefined(rootContainer, 'Can\'t find Popup root element');

createRoot(rootContainer).render(
  <PageContext.Provider value={ { document } }>
    <ThemeProvider>
      <Options/>
    </ThemeProvider>
  </PageContext.Provider>,
);
