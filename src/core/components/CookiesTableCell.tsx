import { Flex, Tooltip } from '@mantine/core';
import { type FC, type KeyboardEvent, useCallback } from 'react';
import { useCopyToClipboard, useTranslation } from '@core/hooks';

export interface CookiesTableCellProps {
  value: string;
}

export const CookiesTableCell: FC<CookiesTableCellProps> = ({ value }) => {
  const t = useTranslation('cookies_table');
  const { copied, copy } = useCopyToClipboard();

  const onClick = useCallback(() => {
    void copy(value);
  }, [copy, value]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <Tooltip label={value} openDelay={300}>
      <Flex
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {copied ? t('cell_copied') : value}
      </Flex>
    </Tooltip>
  );
};
