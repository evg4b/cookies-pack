import { Chip } from '@mantine/core';
import { IconClockHour2 } from '@tabler/icons-react';
import { FC } from 'react';
import { GetInputPropsReturnType } from '@mantine/form';
import { useTranslation } from '@core/hooks';

export const SessionChip: FC<GetInputPropsReturnType> = (props) => {
  const t = useTranslation('cookie_editor');

  return (
    <Chip {...props} color="blue" icon={<IconClockHour2 size={14}/>}>
      {t('session_label')}
    </Chip>
  );
};
