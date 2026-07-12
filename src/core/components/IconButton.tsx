import { FC } from 'react';
import { ActionIcon, ActionIconProps, MantineColor, Tooltip } from '@mantine/core';

export type IconButtonProps = {
  label: string;
  onClick: () => void;
  icon: FC<{ size: number }>;
  color?: MantineColor;
  variant?: ActionIconProps['variant'];
};

export const IconButton: FC<IconButtonProps> = ({ label, onClick, icon: Icon, color, variant }) => {
  return (
    <Tooltip label={label}>
      <ActionIcon aria-label={label} color={color} onClick={onClick} variant={variant}>
        <Icon size={16}/>
      </ActionIcon>
    </Tooltip>
  );
};