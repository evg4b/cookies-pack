import { If } from '@shared/components';
import { useTimedValue } from '@shared/hooks';
import { PageContext } from '@shared/hooks/page';
import type { CSSProperties, FC, MouseEventHandler } from 'react';
import React, { useCallback, useContext } from 'react';

export interface CookiesTableCellProps {
  value: string;
}

const styles: CSSProperties & { 'text-wrap': string, 'text-overflow': string } = {
  'text-wrap': 'nowrap',
  'text-overflow': 'ellipsis',
  'overflow': 'hidden',
};

const spanStyles = {
  color: 'rgb(161, 161, 170)',
};

export const CookiesTableCell: FC<CookiesTableCellProps> = ({ value }) => {
  const { clipboard } = useContext(PageContext);
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal: MouseEventHandler<HTMLDivElement> = useCallback(async () => {
    await clipboard.writeText(value);
    setCopied(true);
  }, [setCopied, clipboard]);

  return (
    <div role="button" className="cursor-pointer select-none" title={ value } style={ styles } onClick={ onClickInternal }>
      <If condition={ !copied }>
        { value }
      </If>
      <If condition={ copied }>
        <span style={ spanStyles }>Copied</span>
      </If>
    </div>
  );
};
