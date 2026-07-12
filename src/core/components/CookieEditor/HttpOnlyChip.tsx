import { Chip } from '@mantine/core';
import { IconShield } from '@tabler/icons-react';
import { FC } from 'react';
import { GetInputPropsReturnType } from '@mantine/form';
import { useTranslation } from '@core/hooks';

export const HttpOnlyChip: FC<GetInputPropsReturnType> = (props) => {
  const t = useTranslation('cookie_editor');

  return (
    <Chip {...props} color="cyan" icon={<IconShield size={14}/>}>
      {t('http_only_label')}
    </Chip>
  );
};
