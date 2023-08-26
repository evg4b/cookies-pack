import { Card, CardBody } from '@nextui-org/react';
import { px } from '@shared/helpres';
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
          gap: px(4),
        } }>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor"
               className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
          </svg>
          This page is not supported
        </CardBody>
      </Card>
    </div>
  );
};
