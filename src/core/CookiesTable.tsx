import CookiesTableCell from '@core/CookiesTableCell';
import { Icon } from '@iconify/react';
import type { CSSProperties, FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { JetbrainsCookies } from '@core/export/jetbranis';
import { Button, ButtonGroup, EmptyState, Table } from '@heroui/react';

export interface CookiesTableProps {
  cookies: Cookie[];

  copyToClipboard(value: string | Cookie[]): void;

  saveToCookieFile(value: string): void;

  deleteCookie(cookie: Cookie): void;
}

const styles: CSSProperties = {
  // display: 'flex',
  // gap: '7px',
  // marginLeft: '-100%',
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
    <Table>
      <Table.ResizableContainer>
        <Table.ScrollContainer>
          <Table.Content aria-label={t('aria_label')} className="h-full min-h-80 max-h-80">
            <Table.Header>
              <Table.Column isRowHeader key="name" defaultWidth="1fr">
                {t('columns.name')}
              </Table.Column>
              <Table.Column key="path" defaultWidth="1fr">
                {t('columns.path')}
              </Table.Column>
              <Table.Column key="value" defaultWidth="1fr">
                {t('columns.value')}
              </Table.Column>
              <Table.Column key="action" defaultWidth="0.1fr" minWidth={90}>
                <ButtonGroup variant="tertiary" style={{ margin: '-10px' }}>
                  <Button isIconOnly aria-label="Copy" size="sm" onPress={exportAll}>
                    <Icon icon="heroicons-solid:download"/>
                  </Button>
                  <Button isIconOnly aria-label="Cut" size="sm" onPress={copyAll}>
                    <ButtonGroup.Separator/>
                    <Icon icon="heroicons-solid:clipboard-copy"/>
                  </Button>
                </ButtonGroup>
              </Table.Column>
            </Table.Header>
            <Table.Body renderEmptyState={() => (
              <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                <Icon className="size-6 text-muted" icon="gravity-ui:tray"/>
                <span className="text-sm text-muted">
                  No results found</span>
              </EmptyState>
            )}>
              {cookies.map((item) =>
                <Table.Row key={item.name}>
                  <CookiesTableCell value={item.name}/>
                  <CookiesTableCell value={item.path}/>
                  <CookiesTableCell value={item.value}/>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Button isIconOnly aria-label={t('delete_cookie')} size="sm" variant="danger-soft"
                              onPress={() => deleteCookie(item)}>
                        <Icon className="size-4" icon="gravity-ui:trash-bin"/>
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>,
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table.ResizableContainer>
    </Table>
  );
};
