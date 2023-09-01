import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Card, CardBody } from '@nextui-org/react';
import { useWindowSize } from '@shared/hooks/page';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const NotSupportingBanner: FC = () => {
  useWindowSize(400, 200);
  const { t } = useTranslation();

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
          { t('not_supported') }
        </CardBody>
      </Card>
    </div>
  );
};
