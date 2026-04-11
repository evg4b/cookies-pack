import { Table } from '@heroui/react';
import { If } from '@shared/components';
import { useTimedValue } from '@shared/hooks';
import { PageContext } from '@shared/hooks/page';
import type { CSSProperties, FC } from 'react';
import { useCallback, useContext } from 'react';
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
  const { t } = useTranslation(['cookies_table']);
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal = useCallback(() => {
    clipboard.writeText(value).finally(() => setCopied(true))
      .then();
  }, [setCopied, clipboard]);

  return (
    <Table.Cell onClick={onClickInternal}
                onKeyDown={onClickInternal} tabIndex={0}
                className="cursor-pointer select-none">
      <If condition={!copied}>
        {value}
      </If>
      <If condition={copied}>
          <span style={spanStyles}>
            {t('cell.copied')}
          </span>
      </If>
    </Table.Cell>
  );
};

export default CookiesTableCell;
