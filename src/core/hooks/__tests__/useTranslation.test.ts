import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from '../useTranslation';

describe('useTranslation', () => {
  let getMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getMessage = vi.fn().mockReturnValue('translated');
    vi.stubGlobal('chrome', { i18n: { getMessage } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('prefixes the key with the given namespace', () => {
    const { result } = renderHook(() => useTranslation('cookies_table'));

    const message = result.current('empty_title');

    expect(getMessage).toHaveBeenCalledWith('cookies_table_empty_title', undefined);
    expect(message).toBe('translated');
  });

  it('forwards substitutions to chrome.i18n.getMessage', () => {
    const { result } = renderHook(() => useTranslation('cookies_table'));

    result.current('delete_cookie', ['session']);

    expect(getMessage).toHaveBeenCalledWith('cookies_table_delete_cookie', ['session']);
  });

  it('uses a different prefix per namespace', () => {
    const { result } = renderHook(() => useTranslation('supporting_wrapper'));

    result.current('title');

    expect(getMessage).toHaveBeenCalledWith('supporting_wrapper_title', undefined);
  });
});
