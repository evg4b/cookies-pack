import React, { FC } from 'react';
import { CookiesContainer } from '@core/cookies-tab';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { SupportingWrapper } from '@pages/popup/SupportingWrapper';

const Popup: FC = () => (
  <SupportingWrapper>
    <Tabs aria-label="Dynamic tabs" size="sm">
      <Tab key="bulk-coocies" title="Demo">
        <Card>
          <CardBody>
            <CookiesContainer/>
          </CardBody>
        </Card>
      </Tab>
      <Tab key="bulk-coocies-2" title="Demo 2">
        <Card>
          <CardBody>
            lorem
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  </SupportingWrapper>
);

export default Popup;
