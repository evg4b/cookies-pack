import type { FC } from 'react';
import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { CookiesContainer } from '@src/core';
import { SupportingWrapper } from '@src/popup/SupportingWrapper';

const Popup: FC = () => 
  <SupportingWrapper>
    <Card>
      <CardBody className="p-3">
        <CookiesContainer/>
      </CardBody>
    </Card>
  </SupportingWrapper>
;

export default Popup;
