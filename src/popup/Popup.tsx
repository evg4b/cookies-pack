import { Card, CardBody } from '@nextui-org/react';
import { Cookies } from '@src/core';
import { SupportingWrapper } from '@src/popup/SupportingWrapper';
import type { FC } from 'react';
import React from 'react';

const Popup: FC = () =>
  <SupportingWrapper>
    <Card radius='none'>
      <CardBody>
        <Cookies/>
      </CardBody>
    </Card>
  </SupportingWrapper>
;

export default Popup;
