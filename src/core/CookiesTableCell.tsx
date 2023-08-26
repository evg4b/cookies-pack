import { useTimedValue } from '@shared/hooks';
import type { CSSProperties, FC, MouseEventHandler } from 'react';
import React, { useCallback } from 'react';

export interface CookiesTableCellProps {
  value: string;
}

const styles: CSSProperties & { 'text-wrap': string, 'text-overflow': string } = {
  'text-wrap': 'nowrap',
  'text-overflow': 'ellipsis',
  'overflow': 'hidden',
};

const demo = {
  color: 'rgb(161, 161, 170)',
};

export const CookiesTableCell: FC<CookiesTableCellProps> = ({ value }) => {
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal: MouseEventHandler<HTMLDivElement> = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }, [setCopied]);

  return (
    <div className="cursor-pointer select-none" title={ value } style={ styles } onClick={ onClickInternal }>
      { !copied && value }
      { copied && <span style={ demo }>Copied</span> }
    </div>
  );
};
