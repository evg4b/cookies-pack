import { SupportingWrapper } from './SupportingWrapper';
import type { FC } from 'react';
import Cookies from '../core/Cookies';

const Popup: FC = () =>
  <SupportingWrapper>
    <main className="bg-background">
      <Cookies/>
    </main>
  </SupportingWrapper>
;

export default Popup;
