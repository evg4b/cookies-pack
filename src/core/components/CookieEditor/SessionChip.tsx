import { Chip, ChipProps } from '@mantine/core';
import { IconClockHour2 } from '@tabler/icons-react';
import { type FC } from 'react';
import { useTranslation } from '@core/hooks';
import { iconSize } from '@core/helpers';

export type SessionChipProps = Omit<ChipProps, 'color' | 'icon' | 'children'>;
export const SessionChip: FC<SessionChipProps> = (props) => {
  const t = useTranslation('cookie_editor');
  const icon = <IconClockHour2 size={iconSize(props.size)}/>;

  return (
    <Chip {...props} color="blue" icon={icon}>
      {t('session_label')}
    </Chip>
  );
};
