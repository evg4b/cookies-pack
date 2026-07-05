import { useWindowSize } from '../shared/hooks/page';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export const NotSupportingBanner: FC = () => {
  useWindowSize(400, 200);
  const { t } = useTranslation();

  return (
    <main className="bg-background text-foreground flex flex-col items-center justify-center flex-1">
      <Icon icon="heroicons-solid:emoji-sad" className="w-12 h-12 text-muted"/>
      <span className="text-muted">{t('not_supported')}</span>
    </main>
  );
};
