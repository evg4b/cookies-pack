import { Box, type MantineBreakpoint, Table, Text, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { type FC, JSX, type KeyboardEvent, useCallback } from 'react';
import { useTranslation } from '@core/hooks';

export interface CookiesTableCellProps {
  value: string;
  visibleFrom?: MantineBreakpoint;
  tooltip?: JSX.Element,
}

export const CookiesTableCell: FC<CookiesTableCellProps> = ({ value, visibleFrom, tooltip }) => {
  const t = useTranslation('cookies_table');

  const { copied, copy } = useClipboard({ timeout: 500 });
  const onClick = useCallback(() => copy(value), [copy, value]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <Table.Td
      role="button"
      tabIndex={0}
      visibleFrom={visibleFrom}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <Tooltip label={tooltip ?? value}>
        <Box style={{
          display: 'block',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {copied
            ? <Text size="xs" c="dimmed">{t('cell_copied')}</Text>
            : value}
        </Box>
      </Tooltip>
    </Table.Td>
  );
};
