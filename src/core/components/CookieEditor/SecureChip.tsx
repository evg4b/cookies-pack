import { Chip } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { FC } from 'react';
import { GetInputPropsReturnType } from '@mantine/form';
import { useTranslation } from '@core/hooks';

export const SecureChip: FC<GetInputPropsReturnType> = (props) => {
  const t = useTranslation('cookie_editor');

  return (
    <Chip {...props}  color="green" icon={<IconLock size={14}/>}>
      {t('secure_label')}
    </Chip>
  );
};
