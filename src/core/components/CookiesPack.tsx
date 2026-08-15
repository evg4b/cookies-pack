import { FC, PropsWithChildren, useCallback, useState } from 'react';
import { CookieEditor, CookiesBatchUpdate, CookiesTable, SupportingWrapper } from '@core/components';
import { Stack } from '@mantine/core';
import { useCookieEditors } from '@core/hooks';

type EditorState = { open: true; cookie?: Cookie } | { open: false };

const FullHeight: FC<PropsWithChildren> = ({ children }) => (
  <Stack h="100vh">
    {children}
  </Stack>
);

export const CookiesPack: FC = () => {
  const [editor, setEditor] = useState<EditorState>({ open: false });

  const openAddCookie = useCallback(() => setEditor({ open: true }), []);
  const openEditCookie = useCallback((cookie: Cookie) => setEditor({ open: true, cookie }), []);
  const closeEditor = useCallback(() => setEditor({ open: false }), []);

  const { bulkEditorEnabled } = useCookieEditors();

  if (editor.open) {
    return (
      <FullHeight>
        <CookieEditor cookie={editor.cookie} onClose={closeEditor}/>
      </FullHeight>
    );
  }

  return (
    <FullHeight>
      <SupportingWrapper>
        <Stack flex={3} style={{ overflow: 'hidden' }}>
          <CookiesTable onAddCookie={openAddCookie} onEditCookie={openEditCookie}/>
        </Stack>
        {bulkEditorEnabled && (
          <Stack flex={1}>
            <CookiesBatchUpdate p="0.5em"/>
          </Stack>
        )}
      </SupportingWrapper>
    </FullHeight>
  );
};
