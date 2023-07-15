import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from '@pages/options/Options';

import '../../styles.css';

const rootContainer = document.querySelector("#__root");
if (!rootContainer) {
  throw new Error("Can't find Options root element");
}

createRoot(rootContainer)
  .render(<Options/>);
