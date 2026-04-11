import { SupportingWrapper } from '@src/popup/SupportingWrapper';
import type { FC } from 'react';
import Cookies from '@core/Cookies';

const Popup: FC = () =>
  <SupportingWrapper>
    <main>
      <Cookies/>
    </main>
  </SupportingWrapper>
;

export default Popup;
