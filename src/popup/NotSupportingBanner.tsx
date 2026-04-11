import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useWindowSize } from '@shared/hooks/page';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const NotSupportingBanner: FC = () => {
  useWindowSize(400, 200);
  const { t } = useTranslation();

  return (
    <div>
      <FaceFrownIcon className="w-12 h-12"/>
      {t('not_supported')}
    </div>
  );
};
