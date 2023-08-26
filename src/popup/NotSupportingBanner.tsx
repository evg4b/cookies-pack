import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Card, CardBody } from '@nextui-org/react';
import { useWindowSize } from '@shared/hooks/page';
import type { FC } from 'react';

export const NotSupportingBanner: FC = () => {
  useWindowSize(400, 200);

  return (
    <div className="flex content-center" style={ {
      height: 'inherit',
      justifyContent: 'center',
      alignItems: 'center',
    } }>
      <Card>
        <CardBody style={ {
          display: 'flex',
          // justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
        } }>
          <FaceFrownIcon className="w-12 h-12"/>
          This page is not supported
        </CardBody>
      </Card>
    </div>
  );
};
