import React from 'react';
import Popup from '@pages/popup/Popup';
import { createRoot } from 'react-dom/client';

import '../../styles.css';

const rootContainer = document.querySelector("#__root");
if (!rootContainer) {
  throw new Error("Can't find Popup root element");
}

createRoot(rootContainer).render(<Popup/>);
