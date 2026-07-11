import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSaveFile } from '../saveFile';

describe('useSaveFile', () => {
  let write: ReturnType<typeof vi.fn>;
  let close: ReturnType<typeof vi.fn>;
  let createWritable: ReturnType<typeof vi.fn>;
  let showSaveFilePicker: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    write = vi.fn().mockResolvedValue(undefined);
    close = vi.fn().mockResolvedValue(undefined);
    createWritable = vi.fn().mockResolvedValue({ write, close });
    showSaveFilePicker = vi.fn().mockResolvedValue({ createWritable });
    vi.stubGlobal('window', { showSaveFilePicker });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('writes data through the picked file handle and closes the stream', async () => {
    const { result } = renderHook(() => useSaveFile());
    const options = { suggestedName: 'demo.cookies' };

    await act(async () => {
      await result.current.saveFile('cookie-data', options);
    });

    expect(showSaveFilePicker).toHaveBeenCalledWith(options);
    expect(createWritable).toHaveBeenCalled();
    expect(write).toHaveBeenCalledWith('cookie-data');
    expect(close).toHaveBeenCalled();
  });

  it('logs and does not throw when the picker is cancelled', async () => {
    showSaveFilePicker.mockRejectedValue(new Error('The user aborted a request.'));
    const { result } = renderHook(() => useSaveFile());

    await act(async () => {
      await expect(result.current.saveFile('cookie-data', {})).resolves.toBeUndefined();
    });

    expect(vi.mocked(console.error)).toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
  });
});
