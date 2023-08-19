import React, { CSSProperties, FC, MouseEventHandler, useCallback } from 'react';
import { useTimedValue } from '@shared/hooks/timed';

export interface CookiesTableCellProps {
  value: string;
}

const styles: CSSProperties = {
  'text-wrap': 'nowrap',
  'text-overflow': 'ellipsis',
  'overflow': 'hidden',
} as any;

const demo = {
  color: '#545454',
};

export const CookiesTableCell: FC<CookiesTableCellProps> = ({ value }) => {
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal: MouseEventHandler<HTMLDivElement> = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }, [setCopied]);

  return (
    <div className="cursor-pointer" title={value} style={ styles } onClick={ onClickInternal }>
      { !copied && value }
      { copied && <span style={ demo }>Copied</span> }
    </div>
  );
};
