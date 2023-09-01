import { If } from '@shared/components';
import { useTimedValue } from '@shared/hooks';
import { PageContext } from '@shared/hooks/page';
import type { CSSProperties, FC } from 'react';
import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

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

const CookiesTableCell: FC<CookiesTableCellProps> = ({ value }) => {
  const { clipboard } = useContext(PageContext);
  const { t } = useTranslation(['cookies_table', 'cell']);
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal = useCallback(() => {
    clipboard.writeText(value).finally(() => setCopied(true));
  }, [setCopied, clipboard]);

  return (
    <div role="button"
         className="cursor-pointer select-none"
         tabIndex={ 0 }
         title={ value }
         style={ styles }
         onClick={ onClickInternal }
         onKeyDown={ onClickInternal }>
      <If condition={ !copied }>
        { value }
      </If>
      <If condition={ copied }>
        <span style={ spanStyles }>
          { t('copied') }
        </span>
      </If>
    </div>
  );
};

export default CookiesTableCell;
