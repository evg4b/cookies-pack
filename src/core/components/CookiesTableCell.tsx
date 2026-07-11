import { Box, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { type FC, type KeyboardEvent, useCallback } from 'react';
import { useTranslation } from '@core/hooks';

export interface CookiesTableCellProps {
  value: string;
}

export const CookiesTableCell: FC<CookiesTableCellProps> = ({ value }) => {
  const t = useTranslation('cookies_table');
  const { copied, copy } = useClipboard({ timeout: 1500 });

  const onClick = useCallback(
    () => copy(value),
    [copy, value],
  );

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <Tooltip label={value}>
      <Box
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{
          display: 'block',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {copied ? t('cell_copied') : value}
      </Box>
    </Tooltip>
  );
};
