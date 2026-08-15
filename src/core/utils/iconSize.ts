import { type MantineSize } from '@mantine/core';

const SIZE_MAPPING: Record<MantineSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18
};

export const iconSize = (size?: MantineSize): number => {
  return size
    ? SIZE_MAPPING[size]
    : SIZE_MAPPING.md;
};