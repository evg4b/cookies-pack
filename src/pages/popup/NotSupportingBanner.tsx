import { FC } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useWindowSize } from '@shared/hooks/page';

export const NotSupportingBanner: FC = () => {
  useWindowSize(400, 200);

  return (
    <div>
      <Card>
        <CardBody>
          <p>This page is not supported</p>
        </CardBody>
      </Card>
    </div>
  );
};
