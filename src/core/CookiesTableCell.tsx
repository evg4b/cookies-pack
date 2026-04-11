import { Table } from '@heroui/react';
import { If } from '@shared/components';
import { useTimedValue } from '@shared/hooks';
import { PageContext } from '@shared/hooks/page';
import type { FC } from 'react';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

export interface CookiesTableCellProps {
  value: string;
}

const spanStyles = {
  color: 'rgb(161, 161, 170)',
};

const CookiesTableCell: FC<CookiesTableCellProps> = ({ value }) => {
  const { clipboard } = useContext(PageContext);
  const { t } = useTranslation(['cookies_table']);
  const [copied, setCopied] = useTimedValue(false, 1500);

  const onClickInternal = useCallback(async () => {
    try {
      await clipboard.writeText(value);
      setCopied(true);
    } catch {
      // clipboard unavailable — no-op
    }
  }, [clipboard, setCopied, value]);

  return (
    <Table.Cell onClick={() => void onClickInternal()}
                onKeyDown={() => void onClickInternal()} tabIndex={0}
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
