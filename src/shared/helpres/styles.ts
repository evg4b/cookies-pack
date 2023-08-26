import { isNil } from '@shared/helpres';

export const px = (value: number | undefined | null): string | undefined => {
  return !isNil(value) ? `${ value }px` : undefined;
};
