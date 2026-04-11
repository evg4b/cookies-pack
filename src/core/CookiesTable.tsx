import CookiesTableCell from '@core/CookiesTableCell';
import CopyButton from '@core/CopyButton';
import DeleteButton from '@core/DeleteButton';
import { Icon } from '@iconify/react';
import type { CSSProperties, FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ExportButton from '@core/ExportButton';
import { JetbrainsCookies } from '@core/export/jetbranis';
import { EmptyState, Table } from '@heroui/react';

export interface CookiesTableProps {
  cookies: Cookie[];

  copyToClipboard(value: string | Cookie[]): void;

  saveToCookieFile(value: string): void;

  deleteCookie(cookie: Cookie): void;
}

const styles: CSSProperties = {
  display: 'flex',
  gap: '7px',
  marginLeft: '-100%',
};

export const CookiesTable: FC<CookiesTableProps> = ({ cookies, copyToClipboard, saveToCookieFile, deleteCookie }) => {
  const { t } = useTranslation(['cookies_table']);

  const copyAll = useCallback(() => {
    copyToClipboard(cookies);
  }, [cookies, copyToClipboard]);

  const exportAll = useCallback(() => {
    saveToCookieFile(JetbrainsCookies.encode(cookies));
  }, [cookies, saveToCookieFile]);

  return (
    <Table variant="secondary">
      <Table.ScrollContainer>
        <Table.Content aria-label={t('aria_label')}>
          <Table.Header>
            <Table.Column isRowHeader key="name" width="25%">
              {t('columns.name')}
            </Table.Column>
            <Table.Column key="path" width="13%">
              {t('columns.path')}
            </Table.Column>
            <Table.Column key="value" width="55%">
              {t('columns.value')}
            </Table.Column>
            <Table.Column key="action" width="8%">
              <div style={styles}>
                <ExportButton title={t('export_all_cookies')} onClick={exportAll}/>
                <CopyButton title={t('copy_all_cookies')} onClick={copyAll}/>
              </div>
            </Table.Column>
          </Table.Header>
          <Table.Body renderEmptyState={() => (
            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
              <Icon className="size-6 text-muted" icon="gravity-ui:tray"/>
              <span className="text-sm text-muted">No results found</span>
            </EmptyState>
          )}>
            {cookies.map((item) =>
              <Table.Row key={item.name}>
                <Table.Cell>
                  <CookiesTableCell value={item.name}/>
                </Table.Cell>
                <Table.Cell>
                  <CookiesTableCell value={item.path}/>
                </Table.Cell>
                <Table.Cell>
                  <CookiesTableCell value={item.value}/>
                </Table.Cell>
                <Table.Cell>
                  <DeleteButton title={t('delete_cookie')} onClick={() => deleteCookie(item)}/>
                </Table.Cell>
              </Table.Row>,
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
