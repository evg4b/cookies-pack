import { isNil } from '@shared/helpres/assets';

export const px = (value: number | undefined | null): string | undefined => {
  return !isNil(value) ? `${ value }px` : undefined;
};
