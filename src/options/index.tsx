import { ThemeProvider } from '@shared/components';
import Options from '@src/options/Options';
import { createRoot } from 'react-dom/client';
import '../styles.css';

createRoot(document.body).render(
  <ThemeProvider>
    <Options/>
  </ThemeProvider>,
);
