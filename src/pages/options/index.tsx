import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from '@pages/options/Options';
import { assertIsDefined } from '@shared/helpres/assets';

import '../../styles.css';

const rootContainer = document.querySelector("#__root");
assertIsDefined(rootContainer, "Can't find Popup root element");

createRoot(rootContainer)
  .render(<Options/>);
