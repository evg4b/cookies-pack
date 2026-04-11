import { Icon } from '@iconify/react';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { JetbrainsCookies } from '@core/export/jetbranis';
import { Button, ButtonGroup, EmptyState, Table, TableLayout, Virtualizer } from '@heroui/react';

export interface CookiesTableProps {
  cookies: Cookie[];
  copyToClipboard(value: string | Cookie[]): void;
  saveToCookieFile(value: string): void;
  deleteCookie(cookie: Cookie): void;
}

export const CookiesTable: FC<CookiesTableProps> = ({ cookies, copyToClipboard, saveToCookieFile, deleteCookie }) => {
  const { t } = useTranslation(['cookies_table']);

  const copyAll = useCallback(() => {
    copyToClipboard(cookies);
  }, [cookies, copyToClipboard]);

  const exportAll = useCallback(() => {
    saveToCookieFile(JetbrainsCookies.encode(cookies));
  }, [cookies, saveToCookieFile]);

  return (
    <Virtualizer
      layout={TableLayout}
      layoutOptions={{
        headingHeight: 32,
        rowHeight: 32,
      }}
    >
      <Table>
        <Table.ScrollContainer>
          <Table.Content className="h-75 min-w-175 overflow-auto">
            <Table.Header className="h-full w-full">
              <Table.Column isRowHeader id="name" minWidth={160}>
                {t('columns.name')}
              </Table.Column>
              <Table.Column id="path" minWidth={220}>
                {t('columns.path')}
              </Table.Column>
              <Table.Column id="value" minWidth={240}>
                {t('columns.value')}
              </Table.Column>
              <Table.Column id="actions" minWidth={240}>
                <ButtonGroup variant="tertiary" style={{ margin: '-6px' }}>
                  <Button isIconOnly aria-label={t('export_all_cookies')} size="sm" onPress={exportAll}>
                    <Icon icon="heroicons-solid:download"/>
                  </Button>
                  <Button isIconOnly aria-label={t('copy_all_cookies')} size="sm" onPress={copyAll}>
                    <ButtonGroup.Separator/>
                    <Icon icon="heroicons-solid:clipboard-copy"/>
                  </Button>
                </ButtonGroup>
              </Table.Column>
            </Table.Header>
            <Table.Body items={cookies} renderEmptyState={() => (
              <EmptyState
                className="flex h-full w-full flex-col items-center justify-center min-h-60 gap-4 text-center">
                <Icon className="size-10 text-muted" icon="ci:cookie"/>
                <span className="text-sm text-muted">
                             {t('no_cookies')}
                           </span>
              </EmptyState>
            )}>
              {(item) => (
                <Table.Row id={`${item.storeId}:${item.domain}:${item.path}:${item.name}`}>
                  <Table.Cell>
                    <span style={{ textOverflow: 'clip' }}>
                      {item.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{item.path}</Table.Cell>
                  <Table.Cell>{item.value}</Table.Cell>
                  <Table.Cell>
                    <Button isIconOnly aria-label={t('delete_cookie')} size="sm" variant="danger-soft"
                            onPress={() => deleteCookie(item)}>
                      <Icon className="size-4" icon="gravity-ui:trash-bin"/>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Virtualizer>
  );
};
