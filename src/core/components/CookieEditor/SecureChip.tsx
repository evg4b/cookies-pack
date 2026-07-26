import { Chip, ChipProps } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { FC } from 'react';
import { useTranslation } from '@core/hooks';
import { iconSize } from '@core/components/CookieEditor/helpers.ts';

export type SecureChipProps = Omit<ChipProps, 'color' | 'icon' | 'children'>;
export const SecureChip: FC<SecureChipProps> = (props) => {
  const t = useTranslation('cookie_editor');
  const icon = <IconLock size={iconSize(props.size)}/>;

  return (
    <Chip {...props} color="green" icon={icon}>
      {t('secure_label')}
    </Chip>
  );
};
