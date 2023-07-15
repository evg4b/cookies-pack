import React from 'react';
import Popup from '@pages/popup/Popup';
import { createRoot } from 'react-dom/client';
import { assertIsDefined } from '@shared/helpres/assets';

import '../../styles.css';

const rootContainer = document.querySelector("#__root");
assertIsDefined(rootContainer, "Can't find Popup root element");
createRoot(rootContainer).render(<Popup/>);
