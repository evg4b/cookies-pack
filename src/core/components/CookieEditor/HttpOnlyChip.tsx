import { Chip, ChipProps } from '@mantine/core';
import { IconShield } from '@tabler/icons-react';
import { FC } from 'react';
import { useTranslation } from '@core/hooks';
import { iconSize } from '@core/components/CookieEditor/helpers.ts';

export type HttpOnlyChipProps = Omit<ChipProps, 'color' | 'icon' | 'children'>;
export const HttpOnlyChip: FC<HttpOnlyChipProps> = (props) => {
  const t = useTranslation('cookie_editor');
  const icon = <IconShield size={iconSize(props.size)}/>;

  return (
    <Chip {...props} color="cyan" icon={icon}>
      {t('http_only_label')}
    </Chip>
  );
};
