import { FC, useCallback, useState } from 'react';
import { CookieEditor, CookiesBatchUpdate, CookiesTable, SupportingWrapper } from '@core/components';
import { Stack } from '@mantine/core';
import { useCookieEditors } from '@core/hooks';

type Cookie = chrome.cookies.Cookie;
type EditorState = { open: true; cookie?: Cookie } | { open: false };

export const CookiesPack: FC = () => {
  const [editor, setEditor] = useState<EditorState>({ open: false });

  const openAddCookie = useCallback(() => setEditor({ open: true }), []);
  const openEditCookie = useCallback((cookie: Cookie) => setEditor({ open: true, cookie }), []);
  const closeEditor = useCallback(() => setEditor({ open: false }), []);

  const { bulkEditorEnabled } = useCookieEditors();

  if (editor.open) {
    return (
      <Stack style={{ height: '100vh' }}>
        <CookieEditor cookie={editor.cookie} onClose={closeEditor}/>
      </Stack>
    );
  }

  return (
    <Stack style={{ height: '100vh' }}>
      <SupportingWrapper>
        <Stack flex={3} style={{ overflow: 'hidden' }}>
          <CookiesTable onAddCookie={openAddCookie} onEditCookie={openEditCookie}/>
        </Stack>
        {bulkEditorEnabled && (
          <Stack flex={1}>
            <CookiesBatchUpdate style={{ padding: '0.5em' }}/>
          </Stack>
        )}
      </SupportingWrapper>
    </Stack>
  );
};
