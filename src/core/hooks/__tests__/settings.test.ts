import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import  { type useCookieEditorMode as UseCookieEditorModeFn, type useCookieEditors as UseCookieEditorsFn } from '../settings';
import { type ChromeStorageMock, createChromeStorageMock } from '@src/test/chromeStorageMock';

const loadEditorModeModule = async (): Promise<{
  useCookieEditorMode: typeof UseCookieEditorModeFn;
  useCookieEditors: typeof UseCookieEditorsFn;
}> => {
  vi.resetModules();
  return import('../settings');
};

describe('useCookieEditors', () => {
  let mockChrome: ChromeStorageMock;

  beforeEach(() => {
    mockChrome = createChromeStorageMock();
    vi.stubGlobal('chrome', mockChrome.api);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('defaults the editor mode to both-editors', async () => {
    const { useCookieEditorMode } = await loadEditorModeModule();
    const { result } = renderHook(() => useCookieEditorMode());

    const [mode] = result.current;
    expect(mode).toBe('both-editors');
  });

  it('enables both editors for the both-editors mode', async () => {
    const { useCookieEditors } = await loadEditorModeModule();
    const { result } = renderHook(() => useCookieEditors());

    expect(result.current).toEqual({ bulkEditorEnabled: true, editorEnabled: true });
  });

  it('enables only the bulk editor for the bulk-editor-only mode', async () => {
    mockChrome.data.cookieEditorMode = 'bulk-editor-only';

    const { useCookieEditors } = await loadEditorModeModule();
    const { result } = renderHook(() => useCookieEditors());

    await waitFor(() => {
      expect(result.current).toEqual({ bulkEditorEnabled: true, editorEnabled: false });
    });
  });

  it('enables only the single-cookie editor for the editor-only mode', async () => {
    mockChrome.data.cookieEditorMode = 'editor-only';

    const { useCookieEditors } = await loadEditorModeModule();
    const { result } = renderHook(() => useCookieEditors());

    await waitFor(() => {
      expect(result.current).toEqual({ bulkEditorEnabled: false, editorEnabled: true });
    });
  });

  it('updates the derived flags when the stored mode changes', async () => {
    const { useCookieEditorMode, useCookieEditors } = await loadEditorModeModule();
    const mode = renderHook(() => useCookieEditorMode());
    const editors = renderHook(() => useCookieEditors());

    await waitFor(() => {
      const [state] = mode.result.current;
      expect(state).toBe('both-editors');
    });

    act(() => {
      const [, setMode] = mode.result.current;
      setMode('editor-only');
    });

    expect(editors.result.current).toEqual({ bulkEditorEnabled: false, editorEnabled: true });
  });
});
