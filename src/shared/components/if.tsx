import { FC, PropsWithChildren } from 'react';

export const If: FC<PropsWithChildren<{ condition: boolean | undefined | null }>> = ({ condition, children }) => {
  if (condition) {
    return children;
  }

  return null;
};
